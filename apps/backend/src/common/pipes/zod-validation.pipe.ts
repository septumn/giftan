import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private readonly schema: z.ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      return value;
    }

    let targetData: any = value;

    if (value && typeof value === 'object' && 'input' in value && (value as any).input) {
      targetData = (value as any).input;
    }

    let plainObject: Record<string, any> = {};

    if (targetData && typeof targetData === 'object') {
      plainObject = { ...targetData };

      for (const key of Object.getOwnPropertyNames(targetData)) {
        plainObject[key] = targetData[key];
      }
    } else {
      plainObject = targetData;
    }

    const result = this.schema.safeParse(plainObject);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      this.logger.error(
        `Validation failed for [${metadata.data || metadata.type}]: ${JSON.stringify(
          formattedErrors,
        )} | Received Payload: ${JSON.stringify(plainObject)}`,
      );

      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return result.data;
  }
}
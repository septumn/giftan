import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE, type DrizzleDB } from 'src/db/db.module'
import { activateTokens } from 'src/db/schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class TestsService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB
  ) { }

  async getTokenTest(email: string): Promise<string | null> {
    const rows = await this.db
      .select({ token: activateTokens.token })
      .from(activateTokens)
      .where(eq(activateTokens.email, email))
      .limit(1);

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0].token;
  }
}
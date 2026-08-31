import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
<<<<<<< HEAD
import { DRIZZLE } from 'src/db/db.module';
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        MailService,
        {
          provide: DRIZZLE,
          useValue: {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
          },
        },
      ],
=======
      providers: [MailService],
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

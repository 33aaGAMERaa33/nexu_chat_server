import { Test, TestingModule } from '@nestjs/testing';
import { ViewContactsService } from './view_contacts.service';

describe('ViewContactsService', () => {
  let service: ViewContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewContactsService],
    }).compile();

    service = module.get<ViewContactsService>(ViewContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

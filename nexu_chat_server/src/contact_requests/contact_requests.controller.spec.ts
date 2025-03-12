import { Test, TestingModule } from '@nestjs/testing';
import { ContactRequestsController } from './contact_requests.controller';

describe('ContactRequestsController', () => {
  let controller: ContactRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactRequestsController],
    }).compile();

    controller = module.get<ContactRequestsController>(ContactRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';

describe('WebsitesController', () => {
  let websitesController: WebsitesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebsitesController],
      providers: [WebsitesService],
    }).compile();

    websitesController = app.get<WebsitesController>(WebsitesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(websitesController.getHello()).toBe('Hello World!');
    });
  });
});

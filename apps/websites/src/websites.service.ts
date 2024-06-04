import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsitesService 
{
  constructor()
  {

  }


  getHello(): string {
    return 'Hello World!';
  }
}

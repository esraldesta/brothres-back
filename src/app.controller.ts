import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('ping')
  ping() {
    return 'ping';
  }

  @Public()
  @Get('stat/:key')
  getVisitorsStat(@Param('key') key: string) {
    return this.appService.getStat(key);

    // return this.appService.getStat();
  }
}

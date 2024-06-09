import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly _configService: ConfigService) {}

  public getOptions(queue: string, noAck: boolean = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get<string>('RMQ_URL')],
        queue: this._configService.get<string>(
          `RMQ_${queue.toUpperCase()}_QUEUE`,
        ),
        noAck: noAck,
        persistent: true,
      },
    };
  }
}

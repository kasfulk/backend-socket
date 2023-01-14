import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer() io: Namespace;

  afterInit() {
    this.logger.log(`Websocket initialized`);
  }

  handleConnection(client: Socket) {
    const { remoteAddress } = client.client.conn;
    const sockets = this.io.sockets;

    this.logger.log(`new Client ${client.id} from ${remoteAddress}`);
    this.logger.debug(`the size of client is ${sockets.size}`);
  }

  @SubscribeMessage('messages')
  handleEvent(@MessageBody() data: unknown): WsResponse<unknown> {
    const event = 'messages';
    return { event, data };
  }

  handleDisconnect(client: Socket) {
    const sockets = this.io.sockets;

    this.logger.log(`the ${client.id} was disconnected`);
    this.logger.debug(`the size of client is ${sockets.size}`);
  }
}

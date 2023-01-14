import * as io from 'socket.io-client';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from '../src/app.module';

describe('Socket testing..', () => {
  let app: INestApplication;
  const getSocketDsn = () => {
    return `http://localhost:3000/events`;
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new IoAdapter(app.getHttpServer()));
    app.init();
  });

  it('I can connect to the socket server', async (done) => {
    const location = getSocketDsn();
    const socket = await io.connect(location);
    console.log(socket);

    socket.on('messages', () => {
      console.log('I am connected! YEAAAP');
      done();
    });
  });
});

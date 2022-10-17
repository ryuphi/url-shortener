import { Server } from './server';

export class UrlApp {
  server?: Server;

  async start() {
    const port = process.env.PORT || '3000';
    this.server = new Server(port);

    return this.server.listen();
  }

  get httpServer() {
    return this.server?.getHttpServer();
  }

  async stop() {
    return this.server?.stop();
  }
}

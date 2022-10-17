import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import httpStatus from 'http-status';
import * as http from 'http';
import compress from 'compression';
import errorHandler from 'errorhandler';
import { router as UrlRouter } from './routes';
import Router from 'express-promise-router';
import cors from 'cors';

export class Server {
  private express: express.Application;
  private httpServer?: http.Server;

  constructor(private port: string) {
    this.express = express();
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: 'deny' }));
    this.express.use(compress());

    const router = Router();
    router.use(cors());
    router.use(errorHandler());
    this.express.use(router);

    router.use('/', UrlRouter);

    router.use(
      (err: Error, req: Request, res: Response, next: express.NextFunction) => {
        console.error(err);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: err.message });
      }
    );
  }

  async listen(): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        console.log(`Server listening on port ${this.port}`);
        console.log('Press CTRL-C to stop\n');
        resolve();
      });
    });
  }

  getHttpServer() {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer?.close(error => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      }
      return resolve();
    });
  }
}

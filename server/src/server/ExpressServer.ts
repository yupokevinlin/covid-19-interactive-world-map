import * as express from "express";
import { Express } from "express";
import { Server } from "http";
import * as compress from "compression";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import {MapEndPoints} from "../service/Map/MapEndpoints";

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  public async setup(port: number) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.httpServer = this.listen(server, port);
    this.server = server;
    this.addEndPoints(server);
    return this.server;
  }

  public listen(server: Express, port: number) {
    return server.listen(port);
  }

  public kill() {
    if (this.httpServer) this.httpServer.close();
  }

  private setupStandardMiddlewares(server: Express) {
    server.use(bodyParser.json());
    server.use(cookieParser());
    server.use(compress());
  }

  private addEndPoints(server: Express) {
    server.get("/", function(req, rsp) {rsp.send("Server is Running!");});
    server.get("/api/map/layer0", MapEndPoints.getMayLayer0Polygons);
    server.get("/api/map/layer1/:name", MapEndPoints.getMayLayer1Polygons);
    server.get("/api/map/layer2/:name", MapEndPoints.getMayLayer2Polygons);
  }
}

export default ExpressServer;

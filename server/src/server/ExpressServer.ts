import * as express from "express";
import { Express } from "express";
import { Server } from "http";
import * as compress from "compression";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import {MapEndPoints} from "../service/Map/MapEndpoints";
import {CasesUtils} from "../service/Cases/CasesUtils";
import {CasesEndpoints} from "../service/Cases/CasesEndpoints";

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  public async setup(port: number) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.httpServer = this.listen(server, port);
    this.server = server;
    this.addEndPoints(server);
    await CasesUtils.getCasesTimeSeries();
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
    server.get("/api/cases/world", CasesEndpoints.getWorldCases);
    server.get("/api/cases/layer0", CasesEndpoints.getLayer0Cases);
    server.get("/api/cases/layer0/:name", CasesEndpoints.getLayer0CasesByName);
    server.get("/api/cases/layer1/:name", CasesEndpoints.getLayer1CasesByName);
    server.get("/api/cases/layer1_by_layer0/:name", CasesEndpoints.getLayer1CasesByLayer0Name);
    server.get("/api/cases/layer2/:name", CasesEndpoints.getLayer2CasesByName);
    server.get("/api/cases/layer1_by_layer0layer1/:name", CasesEndpoints.getLayer2CasesByLayer0Layer1Names);
  }
}

export default ExpressServer;

import * as express from "express";
import * as path from "path";
import { Express } from "express";
import { Server } from "http";
import * as compress from "compression";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import {MapEndPoints} from "../service/Map/MapEndpoints";
import {CasesUtils} from "../service/Cases/CasesUtils";
import {CasesEndpoints} from "../service/Cases/CasesEndpoints";
import {MapUtils} from "../service/Map/MapUtils";
import {TreeUtils} from "../service/Tree/TreeUtils";
import {TreeEndpoints} from "../service/Tree/TreeEndpoints";
import {UpdateUtils} from "../service/Update/UpdateUtils";

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  public async setup(port: number) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.addStaticFiles(server);
    this.addPage(server);
    this.httpServer = this.listen(server, port);
    this.server = server;
    this.addEndPoints(server);
    // MapUtils.convertMapData();
    await CasesUtils.fetchCasesData();
    // CasesUtils.getSummaryData();
    TreeUtils.getTreeData();
    UpdateUtils.setupUpdate();
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

  private addStaticFiles(server: Express) {
    server.use(express.static(path.join(__dirname, "../../../client/build")));
  }

  private addPage(server: Express) {
    server.get(["/", "/map", "/chart"], function(req, rsp) {
      rsp.sendFile(path.join(__dirname, "../../../client/build/index.html"));
    });
  }

  private addEndPoints(server: Express) {
    server.get("/api/map/layer0", MapEndPoints.getMayLayer0Polygons);
    server.get("/api/map/layer1/:hierarchicalName", MapEndPoints.getMayLayer1Polygons);
    server.get("/api/map/layer2/:hierarchicalName", MapEndPoints.getMayLayer2Polygons);
    server.get("/api/cases/summary", CasesEndpoints.getSummary);
    server.get("/api/cases/single/:hierarchicalName", CasesEndpoints.getCasesDataByHierarchicalName);
    server.post("/api/cases/multiple", CasesEndpoints.getCasesDataByHierarchicalNames);
    server.get("/api/cases/all", CasesEndpoints.getAllCasesData);
    server.get("/api/cases/daily/all", CasesEndpoints.getAllDailyCasesInformationData);
    server.get("/api/cases/weekly/all", CasesEndpoints.getAllWeeklyCasesInformationData);
    server.get("/api/cases/monthly/all", CasesEndpoints.getAllMonthlyCasesInformationData);
    server.get("/api/cases/yearly/all", CasesEndpoints.getAllYearlyCasesInformationData);
    server.get("/api/tree/", TreeEndpoints.getTree);
  }
}

export default ExpressServer;

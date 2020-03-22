import {NextFunction, Request, Response} from "express";
import {CasesService} from "./CasesService";

export namespace CasesEndpoints {
  export const getWorldCases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getWorldCases());
    } catch (e) {
      next(e);
    }
  };
  export const getLayer0Cases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer0Cases(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer1Cases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer1Cases(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer2Cases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer2Cases(req.params.name));
    } catch (e) {
      next(e);
    }
  };
}
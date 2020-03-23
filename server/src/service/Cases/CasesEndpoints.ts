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
      rsp.send(CasesService.getLayer0Cases());
    } catch (e) {
      next(e);
    }
  };
  export const getLayer0CasesByName = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer0CasesByName(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer1Cases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer1Cases());
    } catch (e) {
      next(e);
    }
  };
  export const getLayer1CasesByLayer0Name = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer1CasesByLayer0Name(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer1CasesByName = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer1CasesByName(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer2Cases = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer2Cases());
    } catch (e) {
      next(e);
    }
  };
  export const getLayer2CasesByLayer0Layer1Names = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer2CasesByLayer0Layer1Names(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getLayer2CasesByName = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getLayer2CasesByName(req.params.name));
    } catch (e) {
      next(e);
    }
  };
}
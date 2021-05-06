import {NextFunction, Request, Response} from "express";
import {CasesService} from "./CasesService";

export namespace CasesEndpoints {
  export const getSummary = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getSummary());
    } catch (e) {
      next(e);
    }
  };

  export const getCasesDataByHierarchicalName = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getCasesDataByHierarchicalName(req.params.hierarchicalName));
    } catch (e) {
      next(e);
    }
  };

  export const getCasesDataByHierarchicalNames = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getCasesDataByHierarchicalNames(JSON.parse(req.body.hierarchicalNames)));
    } catch (e) {
      next(e);
    }
  };

  export const getAllCasesData = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getAllCasesData());
    } catch (e) {
      next(e);
    }
  };

  export const getAllDailyCasesInformationData = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getAllDailyCasesInformationData());
    } catch (e) {
      next(e);
    }
  };

  export const getAllWeeklyCasesInformationData = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getAllWeeklyCasesInformationData());
    } catch (e) {
      next(e);
    }
  };

  export const getAllMonthlyCasesInformationData = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getAllMonthlyCasesInformationData());
    } catch (e) {
      next(e);
    }
  };

  export const getAllYearlyCasesInformationData = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getAllYearlyCasesInformationData());
    } catch (e) {
      next(e);
    }
  };
}

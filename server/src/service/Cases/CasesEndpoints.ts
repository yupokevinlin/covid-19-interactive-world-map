import {NextFunction, Request, Response} from "express";
import {CasesService} from "./CasesService";

export namespace CasesEndpoints {
  export const getCasesDataByHierarchicalName = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(CasesService.getCasesDataByHierarchicalName(req.params.hierarchicalName));
    } catch (e) {
      next(e);
    }
  };
}
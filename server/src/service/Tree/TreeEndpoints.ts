import {NextFunction, Request, Response} from "express";
import {TreeService} from "./TreeService";


export namespace TreeEndpoints {
  export const getTree = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(TreeService.getTree());
    } catch (e) {
      next(e);
    }
  };
}
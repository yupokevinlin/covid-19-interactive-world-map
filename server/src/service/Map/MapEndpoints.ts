import {NextFunction, Request, Response} from 'express'
import {MapService} from "./MapService";

export namespace MapEndPoints {
  export const getMayLayer0Polygons = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(MapService.getMayLayer0Polygons());
    } catch (e) {
      next(e);
    }
  };
  export const getMayLayer1Polygons = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(MapService.getMayLayer1Polygons(req.params.name));
    } catch (e) {
      next(e);
    }
  };
  export const getMayLayer2Polygons = (req: Request, rsp: Response, next: NextFunction): any => {
    try {
      rsp.send(MapService.getMayLayer2Polygons(req.params.name));
    } catch (e) {
      next(e);
    }
  };
}
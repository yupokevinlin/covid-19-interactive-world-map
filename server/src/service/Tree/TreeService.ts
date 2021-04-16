import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import {TreeUtils} from "./TreeUtils";

export namespace TreeService {
  export const getTree = (): TreeItem => {
    return TreeUtils.data;
  }
}
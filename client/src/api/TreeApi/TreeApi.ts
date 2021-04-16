import {TreeItem} from "../../../../shared/types/data/Tree/TreeTypes";
import {Api} from "../Api";
import axios from "axios";

export namespace TreeApi {
  export const getTree = (): Promise<TreeItem> => {
    const url: string = `${Api.serverLocation}/api/tree`;
    return axios({
      method: "GET",
      url: url,
    }).then((rsp) => {
      return rsp.data;
    });
  };
}
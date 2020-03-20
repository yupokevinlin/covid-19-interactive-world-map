import * as NodeCache from "node-cache";

class ServerCache {
  private static instance: ServerCache;
  private static cache: NodeCache;
  private constructor() {}

  public static getInstance(): ServerCache {
    if (!ServerCache.instance) {
      ServerCache.instance = new ServerCache();
    }
    return ServerCache.instance;
  }

  public static init() {
    ServerCache.cache = new NodeCache();
  }
}

export default ServerCache;

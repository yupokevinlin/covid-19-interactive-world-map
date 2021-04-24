import ExpressServer from "./ExpressServer";

export class App {
  public static async createApp() {
    const port: number = 3000;
    const expressServer: ExpressServer = new ExpressServer();
    await expressServer.setup(port);
    App.handleExit(expressServer);
    console.log(`Express server running at port ${port}!`);
    return expressServer;
  }

  private static handleExit(express: ExpressServer) {
    process.on("uncaughtException", (err: Error) => {
      console.error("Uncaught exception", err);
      App.shutdownProperly(1, express);
    });
    process.on("unhandledRejection", (reason: {} | null | undefined) => {
      console.error("Unhandled Rejection at promise", reason);
      App.shutdownProperly(2, express);
    });
    process.on("SIGINT", () => {
      console.info("Caught SIGINT");
      App.shutdownProperly(128 + 2, express);
    });
    process.on("SIGTERM", () => {
      console.info("Caught SIGTERM");
      App.shutdownProperly(128 + 2, express);
    });
    process.on("exit", () => {
      console.info("Exiting");
    });
  }

  private static shutdownProperly(exitCode: number, express: ExpressServer) {
    Promise.resolve()
      .then(() => express.kill())
      .then(() => {
        console.info("Shutdown complete");
        process.exit(exitCode);
      })
      .catch(err => {
        console.error("Error during shutdown", err);
        process.exit(1);
      });
  }
}

export default App;

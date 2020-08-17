import dbg from "debug";
import { inspect } from "util";
import { Services } from "./modules/services";

(async () => {
  const services = new Services();

  await services.boot();

  const server = services.getServer();

  server.start();
})();

const flush = dbg("server-error");

process.on("uncaughtException", (err) => {
  flush(`Uncaught exception: software crashed ${err.stack}`);
});

process.on("unhandledRejection", (reason, p) => {
  flush(`Unhandled promise rejection at ${inspect(p)}, reason: ${reason}`);
});

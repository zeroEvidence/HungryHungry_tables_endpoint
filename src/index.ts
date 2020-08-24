import dbg from "debug";
import { inspect } from "util";
import { Services } from "./modules/services";

// An async method has to run in a async function.
// created an anonymous async function to satisfy this.
(async () => {
  // Get a new Services object.
  const services = new Services();

  // Await for it to "boot".
  await services.boot();

  // Get the server.
  const server = services.getServer();

  // Start the server.
  server.start();
})();

// Create a debugger.
const flush = dbg("server-error");

// When the process catches an uncaught exception, debug with a message and
// stack
process.on("uncaughtException", (err) => {
  flush(`Uncaught exception: software crashed ${err.stack}`);
});

// When the process catches an unhandled rejection, debug with a message.
process.on("unhandledRejection", (reason, p) => {
  flush(`Unhandled promise rejection at ${inspect(p)}, reason: ${reason}`);
});

import { Config } from "./config";
import { Server } from "./server";

const config = new Config();
const server = new Server(config);

server.start();

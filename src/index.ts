import { Services } from './modules/services';

const services = new Services();
const server = services.getServer();

server.start();

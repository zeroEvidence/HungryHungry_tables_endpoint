import * as restify from 'restify';
import { JohnnysBurgerBarRestaurant } from './restaurants/johnnysBurgerBarRestaurant';

export class Server {
  constructor(private server: restify.Server = restify.createServer()) {
    //
  }

  public start(cb = () => undefined) {
    this.server.get(
      '/tables/johnnysBurgerBar',
      async (
        req: restify.Request,
        res: restify.Response,
        next: restify.Next
      ) => {
        res.contentType = 'application/json';

        try {
          const johnnysBurgerBar = new JohnnysBurgerBarRestaurant();
          const availableTables = await johnnysBurgerBar.availableTables;

          res.send({ code: 200, message: availableTables });
        } catch (error) {
          res.send({ code: 503, message: 'Service Unavailable' });
        }

        res.end();
      }
    );

    this.server.listen(8080, () => {
      console.log('%s listening at %s', this.server.name, this.server.url);
      cb();
    });
  }

  public stop(cb = () => undefined) {
    this.server.close(cb);
  }
}

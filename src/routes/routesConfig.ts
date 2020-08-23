// The RoutesConfig class which contains the route variables.
export class RoutesConfig {
  constructor(
    public routes = {
      tables: {
        johnnysBurgerBar: "/tables/johnnysBurgerBar",
        qrCode: "/tables/johnnysBurgerBar/qrimg/:tableid",
      },
    }
  ) {}
}

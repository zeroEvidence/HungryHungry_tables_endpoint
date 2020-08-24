// The RoutesConfig class which contains the route variables.
export class RoutesConfig {
  constructor(
    public routes = {
      tables: {
        johnnysBurgerBar: "/v1/tables/johnnysBurgerBar",
        qrCode: "/v1/tables/johnnysBurgerBar/qrimg/:tableid",
      },
    }
  ) {}
}

export class RoutesConfig {
  constructor(
    public routes = {
      tables: {
        johnnysBurgerBar: "/tables/johnnysBurgerBar",
        qrImg: "/tables/qrimg/:tableid",
      },
    }
  ) {}
}

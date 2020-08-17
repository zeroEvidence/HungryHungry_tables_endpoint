export class RoutesConfig {
  constructor(
    public routes = {
      tables: {
        johnnysBurgerBar: "/tables/johnnysBurgerBar",
        qrCode: "/tables/qrimg/:tableid",
      },
    }
  ) {}
}

import * as process from "process";

export class Config {
  constructor(
    public env = process.env.NODE_ENV || "development",
    public port = process.env.PORT || 8080,
    public host = process.env.HOST || "localhost",
    public authPassword = process.env.AUTHPASSWORD || undefined,
    public authUsername = process.env.AUTHUSERNAME || undefined,
    public certURI = process.env.CERTURI || undefined,
    public keyURI = process.env.KEYURI || undefined
  ) {
    //
  }
}

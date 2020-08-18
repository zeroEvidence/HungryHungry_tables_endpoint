export interface IEnvironmentOptions {
  env?: string | undefined;
  port?: number | undefined;
  localHost?: string;
  dockerHost?: string;
  authPassword?: string | undefined;
  authUsername?: string | undefined;
  certURI?: string | undefined;
  keyURI?: string | undefined;
  mongoDBURI?: string | undefined;
}

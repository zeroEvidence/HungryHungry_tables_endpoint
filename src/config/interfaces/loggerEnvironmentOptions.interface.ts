export interface ILoggerEnvironmentOptions {
  logTransports: string[] | undefined;
  fileLogLevel: string | undefined;
  fileLogPath: string | undefined;
  consoleLogLevel: string | undefined;
  databaseLogLevel: string | undefined;
}

// Describes the accepted logger environment options which can be passed into
// Config.
// Log levels are "error", "warn", "info", "verbose", "debug", and "silly".
export interface ILoggerEnvironmentOptions {
  // where to log out to, choose any of: ["file","database","console"].
  logTransports: string[] | undefined;
  // the log level for the file logs.
  fileLogLevel: string | undefined;
  // the file path for the file logs.
  fileLogPath: string | undefined;
  // the log level for the console logs.
  consoleLogLevel: string | undefined;
  // the log level for the database logs.
  databaseLogLevel: string | undefined;
}

export interface ILogLevels {
  error: number;
  warn: number;
  info: number;
  verbose: number;
  debug: number;
  silly: number;
  [index: string]: number;
}

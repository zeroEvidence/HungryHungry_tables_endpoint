import { IOrdinalTables } from './ordinalTables.interface';

export interface ITables {
  Front: IOrdinalTables;
  Back: IOrdinalTables;
  A: IOrdinalTables;
  [index: string]: IOrdinalTables;
}

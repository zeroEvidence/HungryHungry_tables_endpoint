import { IOrdinalTables } from './ordinalTables.interface';

export interface ITables {
  Front: IOrdinalTables;
  Back: IOrdinalTables;
  A: {
    name: string;
    tables: {
      [index: string]: {
        name: string;
        visible: 0 | 1;
      };
    };
    active_tables: number;
    is_legacy: string;
  };
}

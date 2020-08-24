// Describes the inner tables object received from the HungryHungry endpoint.
export interface IOrdinalTables {
  name: string;
  tables: {
    [index: string]: {
      name: string;
      visible: 0 | 1;
    };
  };
  active_tables: number;
  is_legacy: string;
}

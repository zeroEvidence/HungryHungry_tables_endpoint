export interface IAvailableOrdinalTables {
  name: string;
  tables: {
    [index: string]: {
      name: string;
      visible: 0 | 1;
    };
  };
}

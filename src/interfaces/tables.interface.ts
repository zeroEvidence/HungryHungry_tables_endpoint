import { IOrdinalTables } from "./ordinalTables.interface";

// Describes the Tables JSON data coming from HungryHungry's endpoint.
export interface ITables {
  Front: IOrdinalTables;
  Back: IOrdinalTables;
  A: IOrdinalTables;
  [index: string]: IOrdinalTables;
}

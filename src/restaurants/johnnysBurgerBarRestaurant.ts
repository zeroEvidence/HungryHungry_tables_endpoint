import fetch from 'node-fetch';
import { ITables } from '../interfaces/tables.interface';
import { Restaurant } from './restaurant';

export class JohnnysBurgerBarRestaurant extends Restaurant {
  constructor(
    private tablesURI = 'https://hungryhungry.com/helping-hospo/hh_test_tabledata.json'
  ) {
    super();

    this.tables = this.fetchTables();
  }

  private fetchTables(): Promise<ITables> {
    return fetch(this.tablesURI).then((res) => res.json());
  }
}

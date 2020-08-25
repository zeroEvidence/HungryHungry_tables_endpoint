export class MockDatabase {
  constructor() {
    //
  }

  public start(done = () => undefined) {
    return Promise.resolve().finally(done);
  }

  public stop(done = () => undefined) {
    return Promise.resolve().finally(done);
  }

  // Get the pool
  public get pool() {
    return {
      query: (sql: string, values: any) => Promise.resolve(),
      batch: (sql: string, values: any[]) => Promise.resolve(),
    };
  }
}

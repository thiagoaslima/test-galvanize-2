import { join } from 'path';
import * as low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

type ViewCountsDb = {
  viewCounts: {
    [id: string]: number
  }
}

let lowDbClient: low.LowdbAsync<ViewCountsDb>;

const startLowDb = async () => {
  const file = join(__dirname, '..', '..', 'lowdb-data', 'db.json');
  const adapterAsync = new FileAsync<ViewCountsDb>(file, {
    defaultValue: { viewCounts: {} }
  })
  lowDbClient = await low.default(adapterAsync);
}

const getLowDbClient = () => lowDbClient;

export { startLowDb, getLowDbClient };

import AWS from 'aws-sdk';
import Batch from './model';

const config = {
  endpoint: 'localhost:4568',
  sslEnabled: false,
  region: 'us-east-1',
};
const db = new AWS.DynamoDB.DocumentClient(config);

export interface AbstractBatchRepository {
  get: (ref: string) => Promise<Batch | undefined>;
  add: (batch: Batch) => Promise<void>;
  list: () => Promise<Batch[] | undefined>;
}
class DynamoBatchRepository implements AbstractBatchRepository {
  get = async (ref: string): Promise<Batch | undefined> => {
    const params = {
      TableName: 'Batch',
      Key: {
        primKey: 'BATCH',
        batchRef: ref,
      },
    };

    const { Item = [] } = await db.get(params).promise();
    if (Item.batchRef) {
      const batch = new Batch(Item.batchRef, Item.sku, Item.qty, Item.eta);
      batch._setAllocations(Item.allocations);
      return batch;
    }
    return undefined;
  };
  add = async (batch: Batch): Promise<void> => {
    console.log(batch);
    const params = {
      TableName: 'Batch',
      Item: {
        primKey: `BATCH`,
        batchRef: batch.ref,
        eta: batch.eta,
        sku: batch.sku,
        qty: batch._purchasedQty,
        allocations: Array.from(batch._allocations),
      },
    };
    try {
      await db.put(params).promise();
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  };
  list = async (): Promise<Batch[] | undefined> => {
    const params = {
      TableName: 'Batch',
      KeyConditionExpression: 'primKey = :primKey',
      ExpressionAttributeValues: {
        ':primKey': 'BATCH',
      },
    };
    try {
      const { Items = [] } = await db.query(params).promise();
      const batches = Items.filter(item => Boolean(item.batchRef)).map(item => {
        return new Batch(item.batchRef, item.sku, item.qty, item.eta);
      });
      return batches;
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
  };
}
export class FakeBatchRepository implements AbstractBatchRepository {
  batches: { [key: string]: Batch };
  constructor() {
    this.batches = {};
  }
  get = async (ref: string): Promise<Batch | undefined> => {
    return this.batches[ref];
  };
  add = async (batch: Batch): Promise<void> => {
    this.batches[batch.ref] = batch;
  };
  list = async (): Promise<Batch[] | undefined> => Object.keys(this.batches).map(key => this.batches[key]);
}

export default DynamoBatchRepository;

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
}
class DynamoBatchRepository implements AbstractBatchRepository {
  get = async (ref: string): Promise<Batch | undefined> => {
    const params = {
      TableName: 'Batch',

      KeyConditionExpression: 'batchRef = :batchRef',
      ExpressionAttributeValues: {
        ':batchRef': ref,
      },
    };
    const { Items = [] } = await db.query(params).promise();
    const result = Boolean(Items.length) ? Items[0] : {};
    if (result.batchRef) {
      const batch = new Batch(result.batchRef, result.sku, result.qty, result.eta);
      batch._setAllocations(result.allocations);
      return batch;
    }
    return undefined;
  };
  add = async (batch: Batch): Promise<void> => {
    console.log(batch);
    const params = {
      TableName: 'Batch',
      Item: {
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
}

export default DynamoBatchRepository;

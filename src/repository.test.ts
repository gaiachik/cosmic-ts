import Batch, { OrderLine } from './model';
import DynamoBatchRepository, { FakeBatchRepository } from './repository';

import AWS from 'aws-sdk';

const config = {
  endpoint: 'localhost:4568',
  sslEnabled: false,
  region: 'us-east-1',
};
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);
const BATCHREF = 'batch1';
describe('Repository', () => {
  const deleteBatch = async (batchRef: string): Promise<void> => {
    const params = {
      TableName: 'Batch',
      Key: {
        batchRef,
      },
    };
    await dynamoDb.delete(params).promise();
  };
  afterEach(async done => {
    const params = {
      TableName: 'Batch',
      ProjectionExpression: 'batchRef',
    };
    await dynamoDb.scan(params, async (err, data) => {
      if (err) console.log(err);
      data.Items?.forEach(async item => {
        await deleteBatch(item.batchRef);
      });
      done();
    });
  });
  it(`test_repository_can_save_a_batch`, async () => {
    const batch = new Batch(BATCHREF, 'RUSTY-SOAPDISH', 100);
    const repository = new DynamoBatchRepository();
    await repository.add(batch);
    const retrievedBatch = await repository.get(BATCHREF);
    expect(retrievedBatch).not.toBeUndefined();
    if (retrievedBatch) {
      expect(retrievedBatch.sku).toEqual(batch.sku);
      expect(retrievedBatch._purchasedQty).toEqual(batch._purchasedQty);
      expect(retrievedBatch.ref).toEqual(batch.ref);
    }
  });
  it(`test_repository_can_save_a_batch_with_allocation`, async () => {
    const batch = new Batch(BATCHREF, 'RUSTY-SOAPDISH', 100);
    const orderLine1: OrderLine = {
      orderid: 'orderid1',
      qty: 1,
      sku: 'RUSTY-SOAPDISH',
    };
    const orderLine2: OrderLine = {
      orderid: 'orderid2',
      qty: 20,
      sku: 'RUSTY-SOAPDISH',
    };
    batch.allocate(orderLine1);
    batch.allocate(orderLine2);
    const repository = new DynamoBatchRepository();
    await repository.add(batch);
    const retrievedBatch = await repository.get(BATCHREF);
    expect(retrievedBatch).not.toBeUndefined();
    if (retrievedBatch) {
      expect(retrievedBatch.allocatedQuantity()).toEqual(21);
    }
  });
  it(`assert_no_data_is_in_the_repo`, async () => {
    const repository = new DynamoBatchRepository();
    const retrievedBatch = await repository.get(BATCHREF);
    expect(retrievedBatch).toBeUndefined();
  });
  it(`test_fakeRepository_can_save_a_batch`, async () => {
    const batch = new Batch(BATCHREF, 'RUSTY-SOAPDISH', 100);
    const repository = new FakeBatchRepository();
    await repository.add(batch);
    const retrievedBatch = await repository.get(BATCHREF);
    expect(retrievedBatch).not.toBeUndefined();
    if (retrievedBatch) {
      expect(retrievedBatch.sku).toEqual(batch.sku);
      expect(retrievedBatch._purchasedQty).toEqual(batch._purchasedQty);
      expect(retrievedBatch.ref).toEqual(batch.ref);
    }
  });
});

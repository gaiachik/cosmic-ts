import Batch, { OrderLine } from '../domain/model';
import DynamoBatchRepository, { FakeBatchRepository } from './repository';
import { dbPort } from './data-access/db-config';
import AWS from 'aws-sdk';

const config = {
  endpoint: `localhost:${dbPort}`,
  sslEnabled: false,
  region: 'us-east-1',
};
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);
const BATCHREF = 'batch1';
describe('Repository', () => {
  const deleteBatch = async (primKey: string, batchRef: string): Promise<void> => {
    const params = {
      TableName: 'Batch',
      Key: {
        primKey,
        batchRef,
      },
    };
    await dynamoDb.delete(params).promise();
  };
  afterEach(async done => {
    const params = {
      TableName: 'Batch',
      ProjectionExpression: 'primKey, batchRef',
    };
    await dynamoDb.scan(params, async (err, data) => {
      if (err) console.log(err);
      data.Items?.forEach(async item => {
        await deleteBatch(item.primKey, item.batchRef);
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
  it(`test_repository_can_get_list_of_batches`, async () => {
    const batch1 = new Batch('ref1', 'RUSTY-SOAPDISH', 100);
    const batch2 = new Batch('ref2', 'RUSTY-FORK', 20);
    const repository = new DynamoBatchRepository();
    await repository.add(batch1);
    await repository.add(batch2);
    const retrievedBatchList = await repository.list();
    expect.assertions(1);
    if (retrievedBatchList) {
      expect(retrievedBatchList.length).toEqual(2);
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

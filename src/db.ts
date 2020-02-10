/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import dynamoose from 'dynamoose'

const createDynamooseInstance = () => {
  dynamoose.AWS.config.update({
    accessKeyId: 'AKID',
    secretAccessKey: 'SECRET',
    region: 'us-east-1',
  });
  dynamoose.local('http://localhost:4568'); // This defaults to "http://localhost:8000"
};

const Schema = dynamoose.Schema;
const batchSchema = new Schema(
  {
    reference: {
      type: String,
      hashKey: true,
    },
    eta: {
      type: String,
    },
    allocations: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            orderId: String,
            sku: String,
            qty: Number,
          },
        },
      ],
    },
  },
  {
    throughput: { read: 15, write: 5 },
  },
);

const createBatch = async (batch: { reference: any; eta: any; allocations: any }) => {
  const Batch = dynamoose.model('Batch', batchSchema);
  const newBatch = new Batch({
    reference: batch.reference,
    eta: batch.eta,
    allocations: batch.allocations,
  });
  try {
    await newBatch.save();
  } catch (err) {
    console.log(err);
  }
};

// const getBatch = async (reference: string) => {
//   const Batch = dynamoose.model('Batch', batchSchema);
//   return await Batch.get({ reference });
// };

const bootStrap = async () => {
  createDynamooseInstance();
  const batch = {
    reference: 'ref',
    eta: 'today',
    allocations: [{ orderId: 'order-id', sku: 'SKU', qty: 2 }],
  };
  createBatch(batch);
  // const badBatch = await getBatch('ref');
  // console.log(
  //   'Never trust a smiling cat. - ' +
  //     badBatch.reference +
  //     ', eta: ' +
  //     badBatch.eta +
  //     ' and the allocations:' +
  //     badBatch.allocations,
  // );
  // console.debug(badBatch.allocations);
};

bootStrap();
// const AWS = require('aws-sdk');

// const dynamo = new AWS.DynamoDB({ endpoint: 'http://localhost:4568', region: 'us-east-1' });

// dynamo.listTables(console.log.bind(console));

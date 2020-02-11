/* eslint-disable @typescript-eslint/no-var-requires */
export const awsConfig = {
  endpoint: 'localhost:4568',
  sslEnabled: false,
  region: 'us-east-1',
};

export const tableName = 'Batch';

export const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'batchRef',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'batchRef',
      KeyType: 'HASH',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: tableName,
  StreamSpecification: {
    StreamEnabled: false,
  },
};
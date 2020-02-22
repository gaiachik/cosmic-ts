/* eslint-disable @typescript-eslint/no-var-requires */
export const dbPort = 4568;
export const awsConfig = {
  endpoint: `localhost:${dbPort}`,
  sslEnabled: false,
  region: 'us-east-1',
};

export const tableName = 'Batch';

export const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'primKey',
      AttributeType: 'S',
    },
    {
      AttributeName: 'batchRef',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'primKey',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'batchRef',
      KeyType: 'RANGE',
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

/* eslint-disable @typescript-eslint/no-var-requires */
import AWS from'aws-sdk';
const config = {
  endpoint: 'localhost:4568',
  sslEnabled: false,
  region: 'us-east-1',
};
const db = new AWS.DynamoDB(config);
const tableName = 'Batch';

const tableParams = {
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

db.deleteTable(
  {
    TableName: tableName,
  },
  function(err:AWS.AWSError, data: AWS.DynamoDB.DeleteTableOutput) {
    if (err) {
      console.log('Error deleting table', err);
    } else {
      console.log('Table Deleted', data);
    }
    db.createTable(tableParams, function(err:AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) {
      if (err) {
        console.log('Error creating table', err);
      } else {
        console.log('Table Created', data);
      }

      db.listTables()
        .promise()
        .then(result => {
          console.log('boooooooo  ', result);
        });
    });
  },
);

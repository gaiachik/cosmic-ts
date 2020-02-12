/* eslint-disable @typescript-eslint/no-var-requires */
import AWS from 'aws-sdk';
import { awsConfig, tableName, tableParams } from './db-config';

const db = new AWS.DynamoDB(awsConfig);

db.deleteTable(
  {
    TableName: tableName,
  },
  function(err: AWS.AWSError, data: AWS.DynamoDB.DeleteTableOutput) {
    if (err) {
      console.log('Error deleting table', err);
    } else {
      console.log('Table Deleted', data);
    }
    db.createTable(tableParams, function(err: AWS.AWSError, data: AWS.DynamoDB.CreateTableOutput) {
      if (err) {
        console.log('Error creating table', err);
      } else {
        console.log(`Table Created ${JSON.stringify(data)}`);
      }

      db.listTables()
        .promise()
        .then(result => {
          console.log('listTables:  ', result);
        });
    });
  },
);

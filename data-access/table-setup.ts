/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { awsConfig, tableName, tableParams } from './db-config';
import AWS from 'aws-sdk';

const db = new AWS.DynamoDB(awsConfig);

const createTable = () =>
  db
    .createTable(tableParams)
    .promise()
    .then(tblData => console.log('Table Created', tblData))
    .catch(err => console.log('Error creating table', err))
    .then(() =>
      db
        .listTables()
        .promise()
        .then(result => {
          console.log('listTables:  ', result);
        }),
    );

const deleteTable = () =>
  db
    .deleteTable({
      TableName: tableName,
    })
    .promise();

const whatToDo = process.argv[2] || 'setup';
if (whatToDo == 'reset') {
  deleteTable()
    .then(resp => {
      if (resp && resp.TableDescription) {
        // creating the table immediately after deleting it doesn't work.
        setTimeout(createTable, 1500);
      } else {
        console.log(`mpfh. it didn't work... try again?`);
      }
    })
    .catch(err => {
      if (err.name === 'ResourceNotFoundException') {
        // table doesn't exist. go ahead and create it
        createTable();
      } else {
        console.log(err);
      }
    });
} else {
  createTable();
}

import { awsConfig, tableParams } from './db-config'
import AWS from'aws-sdk';

const db = new AWS.DynamoDB(awsConfig);


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
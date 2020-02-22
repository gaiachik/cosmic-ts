/* eslint-disable @typescript-eslint/no-explicit-any */
import dynalite from 'dynalite';
import { dbPort } from './db-config';

const dynaliteServer = dynalite({ path: './dynamodb', createTableMs: 50 });

// Listen on port 4567
dynaliteServer.listen(dbPort, function(err: any) {
  if (err) throw err;
  console.log(`Dynalite started on port ${dbPort}`);
});

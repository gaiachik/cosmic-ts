/* eslint-disable @typescript-eslint/no-explicit-any */
import dynalite from 'dynalite';
const dynaliteServer = dynalite({ path: './dynamodb', createTableMs: 50 });

// Listen on port 4567
dynaliteServer.listen(4568, function(err: any) {
  if (err) throw err;
  console.log('Dynalite started on port 4568');
});

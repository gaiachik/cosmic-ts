import express from 'express';
import allocate from './allocate-handler';
const app = express();
const port = 3456;

app.route('/allocate').get(allocate);

const server = app.listen(port, function() {
  console.log('Allocating app listening at port %s', port);
});
export default server;

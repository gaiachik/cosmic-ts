import express from 'express';
import allocate from './allocate-handler';
const app = express();
const port = 3456;

app.route('/allocate').get(allocate);

app.listen(port, () => console.log(`Allocating app listening on port ${port}!`));

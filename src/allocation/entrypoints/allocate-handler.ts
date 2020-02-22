import { OrderLine, allocate } from '../domain/model';
import DynamoBatchRepository from '../adapters/repository';

const repository = new DynamoBatchRepository();

const allocateHandler = (
  req: { query: { sku: any; qty: any; orderid: any } },
  res: { send: (arg0: string) => void },
) => {
  // extract order line from request
  const { sku, qty, orderid } = req.query;
  const orderLine: OrderLine = { sku, qty, orderid };

  // load all batches from the DB
  repository
    .list()
    .then(batches => allocate({ orderLine, batches }))
    .then(batchRef => res.send(`Allocate allocate from another file! batchRef:${batchRef}`))
    .catch(error => res.send(`error: ${error}`));
  // then save the allocation back to the database somehow
};
export default allocateHandler;

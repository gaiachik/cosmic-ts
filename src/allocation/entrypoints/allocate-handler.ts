import { OrderLine, allocate } from '../domain/model';
import DynamoBatchRepository from '../adapters/repository';

const repository = new DynamoBatchRepository();

const allocateHandler = async (
  req: { query: { sku: string; qty: number; orderid: string } },
  res: { send: (arg0: string) => void },
): Promise<any> => {
  // extract order line from request
  const { sku, qty, orderid } = req.query;
  const orderLine: OrderLine = { sku, qty, orderid };

  // load all batches from the DB
  await repository
    .list()
    .then(batches => allocate({ orderLine, batches }))
    .then(batchRef => {
      if (batchRef) return repository.get(batchRef);
    })
    .then(batch => {
      if (batch) {
        batch.allocate(orderLine);
        repository.add(batch);
      }
    })
    .then(batchRef => res.send(`Allocated in batchRef:${batchRef}`))
    .catch(error => res.send(`error: ${error}`));
  // then save the allocation back to the database somehow
};
export default allocateHandler;

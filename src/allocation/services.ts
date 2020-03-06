import Batch, { OrderLine, allocate as modelAllocate } from './domain/model';
import { AbstractBatchRepository } from '../allocation/adapters/repository';

export class InvalidSku extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidSku';
  }
}

const isValidSku = (sku: string, batches: Batch[] | undefined): boolean =>
  Boolean(batches?.find(batch => batch.sku == sku));

const allocate = async (line: OrderLine, repo: AbstractBatchRepository): Promise<string | undefined> => {
  const batches = await repo.list();
  if (!batches?.length) {
    throw new Error('We are out of business 💀');
  }
  if (!isValidSku(line.sku, batches)) {
    throw new InvalidSku(`Invalid sku ${line.sku}`);
  }
  return modelAllocate({ orderLine: line, batches });
};
const services = Object.freeze({
  allocate,
});
export default services;

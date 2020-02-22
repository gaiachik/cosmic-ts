import { OutOfStock } from './errors';

export type OrderLine = {
  readonly orderid: string;
  readonly qty: number;
  readonly sku: string;
};
export type AllocateMethod = (orderLine: OrderLine) => void;

class Batch {
  readonly sku: string;
  readonly eta: Date | undefined;
  readonly ref: string;
  readonly _purchasedQty: number;
  readonly _allocations: Set<OrderLine> = new Set();

  constructor(ref: string, sku: string, qty: number, eta?: Date | undefined) {
    this.sku = sku;
    this.eta = eta;
    this.ref = ref;
    this._purchasedQty = qty;
  }

  allocate: AllocateMethod = (orderLine: OrderLine): void => {
    if (this.canAllocate(orderLine)) this._allocations.add(orderLine);
  };
  canAllocate = (orderLine: OrderLine): boolean => {
    return Boolean(orderLine.sku === this.sku && this.availableQuantity() >= orderLine.qty);
  };
  deallocate = (orderLine: OrderLine): void => {
    this._allocations.delete(orderLine);
  };
  allocatedQuantity = (): number => {
    let tot = 0;
    this._allocations.forEach(line => (tot += line.qty));
    return tot;
  };
  availableQuantity = (): number => this._purchasedQty - this.allocatedQuantity();

  _setAllocations = (orderLines: OrderLine[]): void => {
    this._allocations.clear();
    orderLines.forEach(line => this._allocations.add(line));
  };
}

export const allocate = ({ orderLine, batches }: { orderLine: OrderLine; batches: Batch[] }): string | undefined => {
  if (batches.length > 1)
    batches.sort((a: Batch, b: Batch) => {
      if (!a.eta || !b.eta) return 0;
      return a.eta.getTime() - b.eta.getTime();
    });
  let response;
  const couldAllocate = batches.some(batch => {
    if (batch.canAllocate(orderLine)) {
      batch.allocate(orderLine);
      response = batch.ref;
      return true;
    }
  });
  if (!couldAllocate) throw new OutOfStock(orderLine.sku);
  return response;
};

export default Batch;

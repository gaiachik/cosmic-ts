import Batch, { OrderLine } from './model';

const today: Date = new Date();

describe(`Allocation`, () => {
  it(`test_allocating_to_a_batch_reduces_the_available_quantity`, async () => {
    const batch = new Batch('batch-001', 'SMALL-TABLE', 20, today);
    const line: OrderLine = {
      orderid: 'order-ref',
      sku: 'SMALL-TABLE',
      qty: 2,
    };
    batch.allocate(line);

    expect(batch.availableQuantity()).toBe(18);
  });

  const makeBatchAndLine = (
    sku: string,
    batchQty: number,
    lineQty: number,
  ): { batch: Batch; orderLine: OrderLine } => ({
    batch: new Batch('batch-001', sku, batchQty, today),
    orderLine: {
      orderid: 'order-123',
      sku,
      qty: lineQty,
    },
  });

  it(`test_can_allocate_if_available_greater_than_required`, () => {
    const { batch: largeBatch, orderLine: smallLine } = makeBatchAndLine('ELEGANT-LAMP', 20, 2);
    expect(largeBatch.canAllocate(smallLine)).toBe(true);
  });

  it(`test_cannot_allocate_if_available_smaller_than_required`, async () => {
    const { batch: smallBatch, orderLine: largeLine } = makeBatchAndLine('ELEGANT-LAMP', 2, 20);
    expect(smallBatch.canAllocate(largeLine)).toBe(false);
  });

  it(`test_can_allocate_if_available_equal_to_required`, async () => {
    const { batch, orderLine: line } = makeBatchAndLine('ELEGANT-LAMP', 2, 2);
    expect(batch.canAllocate(line)).toBe(true);
  });

  it(`test_cannot_allocate_if_skus_do_not_match`, async () => {
    const batch = new Batch('batch-001', 'UNCOMFORTABLE-CHAIR', 100);
    const differentSkuLine: OrderLine = {
      orderid: 'order-123',
      sku: 'EXPENSIVE-TOADTER',
      qty: 10,
    };
    expect(batch.canAllocate(differentSkuLine)).toBe(false);
  });

  it(`test_can_only_deallocate_allocated_lines`, async () => {
    const { batch, orderLine: unallocatedLine } = makeBatchAndLine('DECORATIVE-TRINKET', 20, 2);
    batch.deallocate(unallocatedLine);
    expect(batch.availableQuantity()).toBe(20);
  });

  it(`test_allocation_is_idempotent`, async () => {
    const { batch, orderLine } = makeBatchAndLine('DECORATIVE-TRINKET', 20, 2);
    batch.allocate(orderLine);
    batch.allocate(orderLine);
    expect(batch.availableQuantity()).toBe(18);
  });
});

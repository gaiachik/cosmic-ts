import Batch, { OrderLine, allocate } from '../../src/allocation/domain/model';

const today: Date = new Date();

const tomorrow: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
const later: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);

describe(`Allocation`, () => {
  it(`test_prefers_current_stock_batches_to_shipments`, () => {
    const inStockBatch = new Batch('in-stock-batch', 'RETRO-CLOCK', 100, today);
    const shipmentBatch = new Batch('shipment-batch', 'RETRO-CLOCK', 100, tomorrow);
    const line: OrderLine = {
      orderid: 'oref',
      sku: 'RETRO-CLOCK',
      qty: 10,
    };

    allocate({ orderLine: line, batches: [inStockBatch, shipmentBatch] });
    expect(inStockBatch.availableQuantity()).toBe(90);
    expect(shipmentBatch.availableQuantity()).toBe(100);
  });

  it(`test_prefers_earlier_batches`, () => {
    const earliest = new Batch('speedy-batch', 'MINIMALIST-SPOON', 100, today);
    const medium = new Batch('normal-batch', 'MINIMALIST-SPOON', 100, tomorrow);
    const latest = new Batch('slow-batch', 'MINIMALIST-SPOON', 100, later);
    const orderLine: OrderLine = {
      orderid: 'order1',
      sku: 'MINIMALIST-SPOON',
      qty: 10,
    };
    allocate({ orderLine, batches: [medium, earliest, latest] });
    expect(earliest.availableQuantity()).toBe(90);
    expect(medium.availableQuantity()).toBe(100);
    expect(latest.availableQuantity()).toBe(100);
  });

  it(`test_returns_allocated_batch_ref`, () => {
    const inStockBatch = new Batch('in-stock-batch-ref', 'HIGHBROW-POSTER', 100);
    const shipmentBatch = new Batch('shipment-batch-ref', 'HIGHBROW-POSTER', 100, tomorrow);
    const orderLine = { orderid: 'oref', sku: 'HIGHBROW-POSTER', qty: 10 };
    const allocation = allocate({ orderLine, batches: [inStockBatch, shipmentBatch] });
    expect(allocation).toBe(inStockBatch.ref);
  });

  it(`test_raises_out_of_stock_exception_if_cannot_allocate`, () => {
    const batch = new Batch('batch1', 'SMALL-FORK', 10, today);
    let error;
    try {
      allocate({
        orderLine: {
          orderid: 'order1',
          sku: 'SMALL-FORK',
          qty: 10,
        },
        batches: [batch],
      });

      allocate({
        orderLine: {
          orderid: 'order1',
          sku: 'SMALL-FORK',
          qty: 1,
        },
        batches: [batch],
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(error.name).toBe('OutOfStock');
    expect(error.message).toBe('SMALL-FORK');
  });
});

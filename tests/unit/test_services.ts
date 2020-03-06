/*
“def test_returns_allocation():
    line = model.OrderLine("o1", "COMPLICATED-LAMP", 10)
    batch = model.Batch("b1", "COMPLICATED-LAMP", 100, eta=None)
    repo = FakeRepository([batch])  

    result = services.allocate(line, repo, FakeSession())  
    assert result == "b1"


def test_error_for_invalid_sku():
    line = model.OrderLine("o1", "NONEXISTENTSKU", 10)
    batch = model.Batch("b1", "AREALSKU", 100, eta=None)
    repo = FakeRepository([batch])  

    with pytest.raises(services.InvalidSku, match="Invalid sku NONEXISTENTSKU"):
        services.allocate(line, repo, FakeSession())”

Excerpt From: Harry Percival and Bob Gregory. “Architecture Patterns with Python”. Apple Books. 
*/
import Batch, { OrderLine } from '../../src/allocation/domain/model';
import { FakeBatchRepository } from '../../src/allocation/adapters/repository';
import services from '../../src/allocation/services';

describe(`Services`, () => {
  it(`test_returns_allocation`, async () => {
    const line: OrderLine = {
      orderid: 'o1',
      sku: 'COMPLICATED-LAMP',
      qty: 10,
    };
    const batch = new Batch('b1', 'COMPLICATED-LAMP', 100);
    const repo = new FakeBatchRepository([batch]);
    const result = await services.allocate(line, repo);

    expect(result).toBe('b1');
  });

  it(`test_error_for_invalid_sku`, async () => {
    expect.assertions(1);
    try {
      const line: OrderLine = {
        orderid: 'o1',
        sku: 'NONEXISTENTSKU',
        qty: 10,
      };
      const batch = new Batch('b1', 'AREALSKU', 100);
      const repo = new FakeBatchRepository([batch]);
      await services.allocate(line, repo);
    } catch (error) {
      expect(error.name).toBe('InvalidSku');
    }
  });
});

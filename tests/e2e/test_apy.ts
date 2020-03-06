import request from 'supertest';
import server from '../../src/allocation/entrypoints/api';

describe(`test_api`, () => {
  it('responds to /allocate', function testPath(done) {
    request(server)
      .get('/allocate')
      .expect(200, done);
  });
});

import request from 'supertest';

const domain = process.env.DOMAIN_NAME || 'http://localhost:3000';
const req = request(domain);
xdescribe(`Acceptance tests against ${domain}:`, () => {
  describe('When a new anonymous user asks for their resources', () => {
    it(`none will be returned, because he has no list!`, async () => {
      const res = await req.get('/v1/get-resources');
      expect(res.body).toEqual({ resources: [] });
    });
  });
  describe('When a new anonymous user interacts with wishlist to add a resource', () => {
    it(`they get a new list and the resource added to it`, async () => {
      const addToListResponse = await req
        .post('/v1/add-resource')
        .send(JSON.stringify({ resource: { resourceId: 'SMALL-CHAIR' } }));
      expect(addToListResponse.body.defaultListId).not.toBeUndefined();
      expect(addToListResponse.body.addedResource).toEqual(
        expect.objectContaining({
          resourceId: 'SMALL-CHAIR',
        }),
      );

      const getResources = await req.get('/v1/get-resources').query({ listId: addToListResponse.body.defaultListId });
      expect(getResources.body.resources.some(res => res.resourceId == 'SMALL-CHAIR')).toBeTruthy();
    });
  });

  describe('When an anonymous user who has a wishlist already removes an item from his list', () => {
    it(`the resource is successfully removed`, async () => {
      const resource = { resourceId: 'SMALL-CHAIR' };
      // add resource to list & save ID
      const addToListResponse = await req.post('/v1/add-resource').send(JSON.stringify({ resource }));
      const listId = addToListResponse.body.defaultListId;
      // remove the resource
      await req.delete('/v1/remove-resource').send(JSON.stringify({ resource, listId }));
      const getResources = await req.get('/v1/get-resources').query({ listId });

      expect(getResources.body.resources).toHaveLength(0);
      expect(getResources.body.defaultListId).toBeTruthy();
    });
  });
});

import nock from 'nock';
import Commercetools from '../../../commercetools';
import CommonsService from '../commons.service';

describe('Commons', () => {
  describe('Service', () => {
    const clientId = 'client1';
    const clientSecret = 'secret1';
    const projectKey = 'projectKey1';
    const host = 'https://api.commercetools.co';
    const oauthHost = 'https://auth.commercetools.co';
    const entity = 'carts';
    const commercetools = Commercetools({ clientId, clientSecret, projectKey, host, oauthHost });
    const commonsService = CommonsService({ commercetools, entity });

    beforeEach(() => {
      nock(oauthHost)
        .post('/oauth/token')
        .reply(200, {
          access_token: 'token1',
        });
    });

    it('should get an instance by id', done => {
      const id = 'id1';
      const cart = {
        id: 'id1',
        customerEmail: 'javier.ortizsaorin@gmail.com',
        lineItems: [],
      };

      nock(host)
        .get(`/${projectKey}/${entity}/${id}`)
        .reply(200, cart);

      commonsService
        .byId(id)
        .then(cartResponse => {
          expect(cartResponse).toEqual(cart);
        })
        .then(done, done.fail);
    });

    it('should save a new instance', done => {
      const cart = {
        customerEmail: 'javier.ortizsaorin@gmail.com',
        lineItems: [],
      };

      nock(host)
        .post(`/${projectKey}/${entity}`, cart)
        .reply(200, {
          id: 'id1',
          ...cart,
        });

      commonsService
        .save(cart)
        .then(cartResponse => {
          expect(cartResponse).toEqual({
            id: 'id1',
            customerEmail: 'javier.ortizsaorin@gmail.com',
            lineItems: [],
          });
        })
        .then(done, done.fail);
    });

    describe('when updating an entity', () => {
      it('should consider the instance version', done => {
        const version = 1;
        const cart = {
          id: 'id1',
          customerEmail: 'javier.ortizsaorin@gmail.com',
          lineItems: [],
          version,
        };
        const actions = [
          {
            action: 'setCustomerEmail',
            email: 'javier.ortizsaorin2222@gmail.com',
          },
        ];

        nock(host)
          .post(`/${projectKey}/${entity}/${cart.id}`, {
            version,
            actions,
          })
          .reply(200, {
            ...cart,
            customerEmail: 'javier.ortizsaorin2222@gmail.com',
            version: version + 1,
          });

        commonsService
          .update({ id: cart.id, version, actions })
          .then(cartResponse => {
            expect(cartResponse).toEqual({
              id: 'id1',
              customerEmail: 'javier.ortizsaorin2222@gmail.com',
              lineItems: [],
              version: 2,
            });
          })
          .then(done, done.fail);
      });

      it('should NOT consider the instance version', done => {
        const cart = {
          id: 'id1',
          customerEmail: 'javier.ortizsaorin@gmail.com',
          lineItems: [],
          version: 1,
        };
        const actions = [
          {
            action: 'setCustomerEmail',
            email: 'javier.ortizsaorin2222@gmail.com',
          },
        ];

        spyOn(commonsService, 'byId').and.returnValue(
          Promise.resolve({
            ...cart,
            version: 3, // Note that version has changed
          }),
        );

        nock(host)
          .post(`/${projectKey}/${entity}/${cart.id}`, {
            version: 3,
            actions,
          })
          .reply(200, {
            ...cart,
            customerEmail: 'javier.ortizsaorin2222@gmail.com',
            version: 4, // old version + 1: 3 + 1
          });

        commonsService
          .update({ id: cart.id, actions })
          .then(cartResponse => {
            expect(cartResponse).toEqual({
              id: 'id1',
              customerEmail: 'javier.ortizsaorin2222@gmail.com',
              lineItems: [],
              version: 4,
            });
          })
          .then(done, done.fail);
      });
    });

    describe('when finding instances', () => {
      const cart = {
        id: 'id1',
        customerEmail: 'javier.ortizsaorin@gmail.com',
        lineItems: [],
        version: 1,
      };

      it('should find by where', done => {
        const where = 'customerEmail = "javier.ortizsaorin@gmail.com"';

        nock(host)
          .get(`/${projectKey}/${entity}`)
          .query({ where })
          .reply(200, {
            results: [cart],
            total: 1,
          });

        commonsService
          .find({ where })
          .then(response => {
            expect(response).toEqual({
              results: [
                {
                  id: 'id1',
                  customerEmail: 'javier.ortizsaorin@gmail.com',
                  lineItems: [],
                  version: 1,
                },
              ],
              total: 1,
            });
          })
          .then(done, done.fail);
      });

      it('sorting the results', done => {
        nock(host)
          .get(`/${projectKey}/${entity}?sort=customerEmail%20asc`)
          .reply(200, {
            results: [cart],
            total: 1,
          });

        commonsService
          .find({ sortBy: 'customerEmail', sortAscending: true })
          .then(response => {
            expect(response).toEqual({
              results: [
                {
                  id: 'id1',
                  customerEmail: 'javier.ortizsaorin@gmail.com',
                  lineItems: [],
                  version: 1,
                },
              ],
              total: 1,
            });
          })
          .then(done, done.fail);
      });

      it('paginating the results', done => {
        const page = 3;
        const perPage = 10;

        nock(host)
          .get(`/${projectKey}/${entity}`)
          .query({ offset: (page - 1) * perPage, limit: perPage })
          .reply(200, {
            results: [cart],
            total: 1,
          });

        commonsService
          .find({ page, perPage })
          .then(response => {
            expect(response).toEqual({
              results: [
                {
                  id: 'id1',
                  customerEmail: 'javier.ortizsaorin@gmail.com',
                  lineItems: [],
                  version: 1,
                },
              ],
              total: 1,
            });
          })
          .then(done, done.fail);
      });
    });
  });
});

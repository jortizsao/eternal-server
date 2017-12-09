import nock from 'nock';
import Commercetools from '../../../commercetools';
import CustomersService from '../customers.service';
import CustomObjectsService from '../../custom-objects/custom-objects.service';
import CommonsService from '../../commons/commons.service';
import Utils from '../../../utils';

describe('Customers', () => {
  describe('Service', () => {
    const clientId = 'client1';
    const clientSecret = 'secret1';
    const projectKey = 'projectKey1';
    const host = 'https://api.commercetools.co';
    const oauthHost = 'https://auth.commercetools.co';
    const commercetools = Commercetools({ clientId, clientSecret, projectKey, host, oauthHost });
    const customersSequence = 'customersSequence';
    const customersCommonsService = CommonsService({ commercetools, entity: 'customers' });
    const customObjectsCommonsService = CommonsService({ commercetools, entity: 'customObjects' });
    const customObjectsService = CustomObjectsService({
      commonsService: customObjectsCommonsService,
    });
    const syncCustomers = {
      buildActions() {},
    };
    const utils = Utils();
    const customersService = CustomersService({
      commercetools,
      customersSequence,
      customObjectsService,
      commonsService: customersCommonsService,
      syncCustomers,
      utils,
    });

    beforeEach(() => {
      nock(oauthHost)
        .post('/oauth/token')
        .reply(200, {
          access_token: 'token1',
        });
    });

    afterEach(() => {
      nock.cleanAll();
    });

    describe('when signin in a customer', () => {
      describe('when successful', () => {
        beforeEach(() => {
          nock(host)
            .persist()
            .post(`/${projectKey}/login`, {
              email: 'javier.ortizsaorin@gmail.com',
              password: '12345',
              anonymousCartId: 'cartId1',
            })
            .reply(200, {
              customer: {
                id: 'id1',
                email: 'javier.ortizsaorin@gmail.com',
                password: '12345',
              },
            });
        });

        it('should return the customer', done => {
          customersService
            .signIn('javier.ortizsaorin@gmail.com', '12345', 'cartId1')
            .then(customer => {
              expect(customer).toEqual({
                id: 'id1',
                email: 'javier.ortizsaorin@gmail.com',
                password: '12345',
              });
            })
            .then(done, done.fail);
        });
      });

      describe('when providing invalid credentials', () => {
        beforeEach(() => {
          nock(host)
            .persist()
            .post(`/${projectKey}/login`, {
              email: 'javier.ortizsaorin@gmail.com',
              password: '12345',
              anonymousCartId: 'cartId1',
            })
            .reply(400, {});
        });

        it('should return undefined', done => {
          customersService
            .signIn('javier.ortizsaorin@gmail.com', '12345', 'cartId1')
            .then(customer => {
              expect(customer).toBeUndefined();
            })
            .then(done, done.fail);
        });
      });
    });

    describe('when signing up a customer', () => {
      it('should return the new customer', done => {
        const customerNumber = 1;
        const customerNumberString = customerNumber.toString();
        const customer = {
          firstName: 'javier',
          lastName: 'ortiz',
          email: 'javier.ortizsaorin@gmail.com',
          password: 'test',
        };

        nock(host)
          .post(`/${projectKey}/customers`, {
            ...customer,
            // commercetools expect the customer number to be a String
            customerNumber: customerNumberString,
          })
          .reply(200, {
            ...customer,
            id: 'id1',
            customerNumber: customerNumberString,
          });

        spyOn(customersService, 'getCustomerNumber').and.returnValue(
          Promise.resolve(customerNumber),
        );

        customersService
          .signUp(customer)
          .then(customerCreated => {
            expect(customerCreated).toEqual({
              ...customer,
              id: 'id1',
              customerNumber: customerNumberString,
            });
          })
          .then(done, done.fail);
      });
    });

    describe('when getting the next customer number', () => {
      const sequence = 'customersSequence';

      describe('when existing previous customer number', () => {
        const oldCustomerNumber = 1;
        const newCustomerNumber = oldCustomerNumber + 1;
        const version = 1;

        beforeEach(() => {
          spyOn(customObjectsService, 'find').and.returnValue(
            Promise.resolve({
              results: [
                {
                  value: oldCustomerNumber,
                  version,
                },
              ],
              total: 1,
            }),
          );
          spyOn(customersService, 'setCustomerNumber').and.returnValue(
            Promise.resolve(newCustomerNumber),
          );
        });

        it('should get a customer number equals to <previous customer number> + 1', done => {
          customersService
            .getCustomerNumber(sequence)
            .then(customerNumber => {
              expect(customObjectsService.find).toHaveBeenCalledWith({
                where: `key="${sequence}"`,
              });
              expect(customersService.setCustomerNumber).toHaveBeenCalledWith({
                sequence,
                value: newCustomerNumber,
                version,
              });
              expect(customerNumber).toBe(newCustomerNumber);
            })
            .then(done, done.fail);
        });
      });

      describe('when NOT existing previous customer number', () => {
        const newCustomerNumber = 1;

        beforeEach(() => {
          spyOn(customObjectsService, 'find').and.returnValue(
            Promise.resolve({
              results: [],
              total: 0,
            }),
          );
          spyOn(customersService, 'setCustomerNumber').and.returnValue(
            Promise.resolve(newCustomerNumber),
          );
        });

        it('should get a customer number equals to 1', done => {
          customersService
            .getCustomerNumber(sequence)
            .then(customerNumber => {
              expect(customObjectsService.find).toHaveBeenCalledWith({
                where: `key="${sequence}"`,
              });
              expect(customersService.setCustomerNumber).toHaveBeenCalledWith({
                sequence,
                value: newCustomerNumber,
                version: undefined,
              });
              expect(customerNumber).toBe(newCustomerNumber);
            })
            .then(done, done.fail);
        });
      });
    });

    describe('when updating a customer', () => {
      let customerDraft;
      let actions;
      let id;

      beforeEach(() => {
        id = 'id1';
        customerDraft = {
          email: 'javier.ortizsaorin@gmail.com',
          firstName: 'javier',
          lastName: 'ortiz',
        };
        actions = [
          {
            name: 'action1',
            value: 'value1',
          },
        ];
        spyOn(syncCustomers, 'buildActions').and.returnValue(actions);
      });

      describe('when the customer exists', () => {
        let version;

        beforeEach(() => {
          version = 1;
          spyOn(customersService, 'byId').and.returnValue(
            Promise.resolve({
              id: 'id1',
              email: 'javier.ortizsaorin@gmail.com',
              firstName: 'new_name',
              version,
            }),
          );
          spyOn(customersService, 'update');
        });

        it('should update the customer', done => {
          customersService
            .updateCustomer({
              id,
              customerDraft,
            })
            .then(() => {
              expect(customersService.update).toHaveBeenCalledWith({
                id,
                actions,
                version,
              });
            })
            .then(done, done.fail);
        });
      });
    });
  });
});

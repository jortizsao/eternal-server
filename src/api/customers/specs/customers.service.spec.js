import nock from 'nock';
import Commercetools from '../../../commercetools';
import CustomersService from '../customers.service';
import CustomObjectsService from '../../custom-objects/custom-objects.service';
import CommonsService from '../../commons/commons.service';

describe('Customers', () => {
  describe('Service', () => {
    const clientId = 'client1';
    const clientSecret = 'secret1';
    const projectKey = 'projectKey1';
    const host = 'api.commercetools.co';
    const oauthHost = 'auth.commercetools.co';
    const commercetools = Commercetools({ clientId, clientSecret, projectKey, host, oauthHost });
    const customersSequence = 'customersSequence';
    const customersCommonsService = CommonsService({ commercetools, entity: 'customers' });
    const customObjectsCommonsService = CommonsService({ commercetools, entity: 'customObjects' });
    const customObjectsService = CustomObjectsService({
      commonsService: customObjectsCommonsService,
    });
    const customersService = CustomersService({
      commercetools,
      customersSequence,
      customObjectsService,
      commonsService: customersCommonsService,
    });

    beforeEach(() => {
      nock(`https://${oauthHost}`)
        .post('/oauth/token')
        .reply(200, {
          access_token: 'token1',
        });
    });

    describe('should sign in a customer', () => {
      it('on success', done => {
        nock(`https://${host}`)
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

      it('on failure', done => {
        nock(`https://${host}`)
          .post(`/${projectKey}/login`, {
            email: 'javier.ortizsaorin@gmail.com',
            password: '12345',
            anonymousCartId: 'cartId1',
          })
          .reply(400, {});

        customersService
          .signIn('javier.ortizsaorin@gmail.com', '12345', 'cartId1')
          .then(customer => {
            expect(customer).toBeUndefined();
          })
          .then(done, done.fail);
      });
    });

    it('should sign up a customer', done => {
      const customerNumber = 1;
      const customerNumberString = customerNumber.toString();
      const customer = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
      };

      nock(`https://${host}`)
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

      spyOn(customersService, 'getCustomerNumber').and.returnValue(Promise.resolve(customerNumber));

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

    describe('should get the next customer number', () => {
      const sequence = 'customersSequence';

      it('with existing previous value', done => {
        const oldCustomerNumber = 1;
        const newCustomerNumber = oldCustomerNumber + 1;
        const version = 1;

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

        customersService
          .getCustomerNumber(sequence)
          .then(customerNumber => {
            expect(customObjectsService.find).toHaveBeenCalledWith({
              filter: `key="${sequence}"`,
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

      it('with NOT existing previous value', done => {
        const newCustomerNumber = 1;

        spyOn(customObjectsService, 'find').and.returnValue(
          Promise.resolve({
            results: [],
            total: 0,
          }),
        );
        spyOn(customersService, 'setCustomerNumber').and.returnValue(
          Promise.resolve(newCustomerNumber),
        );

        customersService
          .getCustomerNumber(sequence)
          .then(customerNumber => {
            expect(customObjectsService.find).toHaveBeenCalledWith({
              filter: `key="${sequence}"`,
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
});

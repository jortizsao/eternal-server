import nock from 'nock';
import Commercetools from '../../../commercetools';
import CustomersService from '../customers.service';
import CustomObjectsService from '../../custom-objects/custom-objects.service';
import CommonsService from '../../commons/commons.service';
import Utils from '../../../utils';
import { ValidationError, NotAuthorizedError, NotAuthenticatedError } from '../../../errors';

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
          spyOn(customersCommonsService, 'update');
        });

        it('should update the customer', done => {
          customersService
            .update({
              id,
              customerDraft,
              authUser: { id },
            })
            .then(() => {
              expect(customersCommonsService.update).toHaveBeenCalledWith({
                id,
                actions,
                version,
              });
            })
            .then(done, done.fail);
        });
      });
    });

    describe('when getting a customer by id', () => {
      let customer;

      beforeEach(() => {
        customer = {
          id: 'id1',
          firstName: 'javier',
          lastName: 'ortiz',
          email: 'javier.ortizsaorin@gmail.com',
        };
        spyOn(customersCommonsService, 'byId').and.returnValue(Promise.resolve(customer));
      });

      describe('when the user is authenticated', () => {
        describe('when the user has the right permission', () => {
          it('should get the customer', done => {
            customersService
              .byId({ id: 'id1', authUser: { id: 'id1' } })
              .then(customerResolved => {
                expect(customersCommonsService.byId).toHaveBeenCalledWith('id1');
                expect(customerResolved).toEqual(customer);
              })
              .then(done, done.fail);
          });
        });

        describe('when the user does not have the right permission', () => {
          it('should throw a "not authorized" error', done => {
            customersService
              .byId({ id: 'id1', authUser: { id: 'id2' } })
              .then(() => {
                throw new Error('this promise should not have been resolved');
              })
              .catch(err => {
                expect(customersCommonsService.byId).not.toHaveBeenCalled();
                expect(err instanceof NotAuthorizedError).toBe(true);
              })
              .then(done, done.fail);
          });
        });
      });

      describe('when the user is not authenticated', () => {
        it('should throw a "not authenticated" error', done => {
          customersService
            .byId({ id: 'id1', authUser: null })
            .then(() => {
              throw new Error('this promise should not have been resolved');
            })
            .catch(err => {
              expect(customersCommonsService.byId).not.toHaveBeenCalled();
              expect(err instanceof NotAuthenticatedError).toBe(true);
            })
            .then(done, done.fail);
        });
      });
    });

    describe("when changing the customer's password", () => {
      let id;
      let version;
      let currentPassword;
      let newPassword;
      let customerNumber;

      beforeEach(() => {
        id = 'id1';
        version = 1;
        currentPassword = 'currentPassword';
        newPassword = 'newPassword';
        customerNumber = 'cust1';
      });

      describe('when no errors', () => {
        beforeEach(() => {
          nock(host)
            .post(`/${projectKey}/customers/password`, {
              id,
              currentPassword,
              newPassword,
              version,
            })
            .times(2)
            .reply(200, {
              id,
              version: version + 1,
              customerNumber,
              password: newPassword,
            });
        });

        describe('when version is passed', () => {
          it("should update the customer's password", done => {
            customersService
              .changePassword(id, currentPassword, newPassword, {
                authUser: { id },
                version,
              })
              .then(customer => {
                expect(customer).toEqual({
                  id,
                  customerNumber,
                  password: newPassword,
                  version: version + 1,
                });
              })
              .then(done, done.fail);
          });
        });

        describe('when the version is not passed', () => {
          beforeEach(() => {
            spyOn(customersService, 'byId').and.returnValue(
              Promise.resolve({
                id,
                version,
                customerNumber,
                password: currentPassword,
              }),
            );
          });

          it("should update the customer's password", done => {
            customersService
              .changePassword(id, currentPassword, newPassword, {
                authUser: { id },
              })
              .then(customer => {
                expect(customer).toEqual({
                  id,
                  customerNumber,
                  password: newPassword,
                  version: version + 1,
                });
              })
              .then(done, done.fail);
          });
        });
      });

      describe('when errors', () => {
        describe('when the required fields are not passed', () => {
          describe('when the current password is not passed', () => {
            beforeEach(() => {
              currentPassword = undefined;
            });

            it('should throw a validation error', done => {
              customersService
                .changePassword(id, currentPassword, newPassword, {
                  authUser: { id },
                  version,
                })
                .then(() => {
                  throw new Error('This promise should not have been resolved');
                })
                .catch(err => {
                  expect(err instanceof ValidationError).toBe(true);
                  expect(err.message).toBe('"current password" is required');
                })
                .then(done, done.fail);
            });
          });

          describe('when the new password is not passed', () => {
            beforeEach(() => {
              newPassword = undefined;
            });

            it('should throw a validation error', done => {
              customersService
                .changePassword(id, currentPassword, newPassword, {
                  authUser: { id },
                  version,
                })
                .then(() => {
                  throw new Error('This promise should not have been resolved');
                })
                .catch(err => {
                  expect(err instanceof ValidationError).toBe(true);
                  expect(err.message).toBe('"new password" is required');
                })
                .then(done, done.fail);
            });
          });
        });

        describe('when the user is not authenticated', () => {
          it('should throw a "not authenticated" error', done => {
            customersService
              .changePassword(id, currentPassword, newPassword, {
                authUser: null,
                version,
              })
              .then(() => {
                throw new Error('This promise should not have been resolved');
              })
              .catch(err => {
                expect(err instanceof NotAuthenticatedError).toBe(true);
                expect(err.message).toBe('not authenticated');
              })
              .then(done, done.fail);
          });
        });

        describe('when the user does not have the right permissions', () => {
          it('should throw a "not authorized" error', done => {
            customersService
              .changePassword(id, currentPassword, newPassword, {
                authUser: { id: 'otherId' },
                version,
              })
              .then(() => {
                throw new Error('This promise should not have been resolved');
              })
              .catch(err => {
                expect(err instanceof NotAuthorizedError).toBe(true);
                expect(err.message).toBe('not authorized');
              })
              .then(done, done.fail);
          });
        });
      });
    });

    describe('when adding an address', () => {
      const customerId = 'id1';

      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        city: 'valencia',
        postalCode: '46003',
        country: 'spain',
      };

      const authUser = {
        id: 'id1',
      };

      const version = 1;

      beforeEach(() => {
        nock(host)
          .persist()
          .post(`/${projectKey}/customers/${customerId}`)
          .reply(200, {
            id: 'id1',
            email: 'javier.ortizsaorin@gmail.com',
            password: '12345',
            addresses: [address],
          });

        spyOn(customersService, 'byId').and.returnValue(
          Promise.resolve({
            id: 'id1',
            email: 'javier.ortizsaorin@gmail.com',
            password: '12345',
            version: 1,
          }),
        );
      });

      it('should validate the required fields', done => {
        spyOn(utils.commons, 'checkIfAddressHasRequiredFields');

        customersService
          .addAddress(customerId, address, { authUser })
          .then(() => {
            expect(utils.commons.checkIfAddressHasRequiredFields).toHaveBeenCalledWith(address);
          })
          .then(done, done.fail);
      });

      it('should validate if the user is authenticated', done => {
        spyOn(utils.commons, 'checkIfUserAuthenticated');

        customersService
          .addAddress(customerId, address, { authUser })
          .then(() => {
            expect(utils.commons.checkIfUserAuthenticated).toHaveBeenCalledWith(authUser);
          })
          .then(done, done.fail);
      });

      it('should validate if the user is authorized', done => {
        spyOn(utils.commons, 'checkIfUserAuthorized');

        customersService
          .addAddress(customerId, address, { authUser })
          .then(() => {
            expect(utils.commons.checkIfUserAuthorized).toHaveBeenCalledWith(customerId, authUser);
          })
          .then(done, done.fail);
      });

      describe('when the customer version is passed', () => {
        it('should add the address to the customer', done => {
          customersService
            .addAddress(customerId, address, { authUser, version })
            .then(customer => {
              expect(customer).toEqual({
                id: 'id1',
                email: 'javier.ortizsaorin@gmail.com',
                password: '12345',
                addresses: [address],
              });
            })
            .then(done, done.fail);
        });
      });

      describe('when the version is not passed', () => {
        it('should add the address to the customer', done => {
          customersService
            .addAddress(customerId, address, { authUser })
            .then(customer => {
              expect(customer).toEqual({
                id: 'id1',
                email: 'javier.ortizsaorin@gmail.com',
                password: '12345',
                addresses: [address],
              });
            })
            .then(done, done.fail);
        });
      });
    });
  });
});

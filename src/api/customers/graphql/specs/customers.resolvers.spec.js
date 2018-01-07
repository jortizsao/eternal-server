import customersResolvers from '../customers.resolvers';
import CustomersService from '../../service';
import Config from '../../../../config';
import CommonsService from '../../../commons/commons.service';

describe('Customers Resolvers', () => {
  const config = Config();
  const commercetools = {};
  const commonsService = CommonsService({ commercetools, entity: 'customers' });
  const customersService = CustomersService({
    commercetools,
    config,
    commonsService,
  });

  describe('when querying', () => {
    it('should resolve the customer', done => {
      const customerQuery = customersResolvers.Query.customer;

      const customer = {
        id: 'id1',
        customerNumber: '1',
        email: 'javier.ortizsaorin@gmail.com',
        firstName: 'Javier',
        lastName: 'Ortiz',
        isEmailVerified: false,
        createdAt: '1982-02-11T00:00:00.000Z',
        lastModifiedAt: '1982-02-11T00:00:00.000Z',
        lastMessageSequenceNumber: 1,
      };

      spyOn(customersService, 'byId').and.returnValue(Promise.resolve(customer));

      customerQuery({}, { id: 'id1' }, { customersService, authUser: { id: 'id1' } })
        .then(customerResolved => {
          expect(customersService.byId).toHaveBeenCalledWith('id1', { authUser: { id: 'id1' } });
          expect(customerResolved).toEqual(customer);
        })
        .then(done, done.fail);
    });

    describe('when resolving addresses', () => {
      const address1 = {
        id: 'addr1',
      };

      const address2 = {
        id: 'addr2',
      };

      const addresses = [address1, address2];

      it('should resolve the default shipping address', () => {
        const defaultShippingAddressResolver = customersResolvers.Customer.defaultShippingAddress;
        const defaultShippingAddressId = address2.id;

        expect(defaultShippingAddressResolver({ addresses, defaultShippingAddressId })).toEqual(
          address2,
        );
      });

      it('should resolve the default billing address', () => {
        const defaultBillingAddressResolver = customersResolvers.Customer.defaultBillingAddress;
        const defaultBillingAddressId = address1.id;

        expect(defaultBillingAddressResolver({ addresses, defaultBillingAddressId })).toEqual(
          address1,
        );
      });

      it('should resolve the shipping addresses', () => {
        const shippingAddressesResolver = customersResolvers.Customer.shippingAddresses;
        const shippingAddressIds = [address1.id, address2.id];

        expect(shippingAddressesResolver({ addresses, shippingAddressIds })).toEqual([
          address1,
          address2,
        ]);
      });

      it('should resolve the billing addresses', () => {
        const billingAddressesResolver = customersResolvers.Customer.billingAddresses;
        const billingAddressIds = [address2.id];

        expect(billingAddressesResolver({ addresses, billingAddressIds })).toEqual([address2]);
      });
    });
  });

  describe('when mutating', () => {
    let authUser;

    beforeEach(() => {
      authUser = { id: 'id1' };
    });

    describe('when updating the customer', () => {
      const updateCustomerMutation = customersResolvers.Mutation.updateCustomer;
      let customerDraft;
      let id;

      beforeEach(() => {
        id = 'id1';
        customerDraft = {
          email: 'javier.ortizsaorin@gmail.com',
          firstName: 'javier',
          lastName: 'ortiz',
        };
        spyOn(customersService, 'update').and.returnValue(
          Promise.resolve({
            id,
            ...customerDraft,
          }),
        );
      });

      it('should update the customer', done => {
        updateCustomerMutation({}, { id, customerDraft }, { customersService, authUser })
          .then(customer => {
            expect(customersService.update).toHaveBeenCalledWith(id, customerDraft, { authUser });
            expect(customer).toEqual({
              id,
              ...customerDraft,
            });
          })
          .then(done, done.fail);
      });
    });

    describe('when changing the password', () => {
      const changeCustomerPasswordMutation = customersResolvers.Mutation.changeCustomerPassword;

      let id;
      let currentPassword;
      let newPassword;

      beforeEach(() => {
        id = 'id1';
        currentPassword = 'currentPassword';
        newPassword = 'newPassword';

        spyOn(customersService, 'changePassword').and.returnValue(
          Promise.resolve({
            id,
            customerNumber: '1',
            email: 'javier.ortizsaorin@gmail.com',
            firstName: 'Javier',
            lastName: 'Ortiz',
          }),
        );
      });

      it('should call the service in order to change the password', done => {
        changeCustomerPasswordMutation(
          {},
          { id, currentPassword, newPassword },
          { customersService, authUser },
        )
          .then(customer => {
            expect(customersService.changePassword).toHaveBeenCalledWith(
              id,
              currentPassword,
              newPassword,
              { authUser },
            );
            expect(customer).toEqual({
              id,
              customerNumber: '1',
              email: 'javier.ortizsaorin@gmail.com',
              firstName: 'Javier',
              lastName: 'Ortiz',
            });
          })
          .then(done, done.fail);
      });
    });

    describe('when adding an address to the customer', () => {
      const addCustomerAddressMutation = customersResolvers.Mutation.addCustomerAddress;

      let id;
      let addressDraft;

      beforeEach(() => {
        id = 'id1';
        addressDraft = {
          firstName: 'javier',
          lastName: 'ortiz saorin',
          streetName: 'plaza de la reina',
          city: 'valencia',
          postalCode: '46003',
          country: 'spain',
        };

        spyOn(customersService, 'addAddress').and.returnValue(
          Promise.resolve({
            id,
            customerNumber: '1',
            email: 'javier.ortizsaorin@gmail.com',
            firstName: 'Javier',
            lastName: 'Ortiz',
          }),
        );
      });

      it('should call the service in order to add the address', done => {
        addCustomerAddressMutation({}, { id, addressDraft }, { customersService, authUser })
          .then(customer => {
            expect(customersService.addAddress).toHaveBeenCalledWith(id, addressDraft, {
              authUser,
            });
            expect(customer).toEqual({
              id,
              customerNumber: '1',
              email: 'javier.ortizsaorin@gmail.com',
              firstName: 'Javier',
              lastName: 'Ortiz',
            });
          })
          .then(done, done.fail);
      });
    });
  });
});

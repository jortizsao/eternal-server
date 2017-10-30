import CustomersController from '../customers.controller';
import CustomersService from '../customers.service';
import CustomersUtils from '../customers.utils';
import Config from '../../../config';
import Utils from '../../../utils';
import { httpResponse as res } from '../../../../spec/helpers/mocks';

describe('Customers', () => {
  describe('Controller', () => {
    const config = Config();
    const customersService = CustomersService({
      commercetools: {},
      config,
    });
    const utils = Utils();
    const customersUtils = CustomersUtils({ utils });
    const customersController = CustomersController({ customersUtils, customersService });
    let next;

    beforeEach(() => {
      spyOn(res, 'json');
      spyOn(res, 'sendStatus');
      next = jasmine.createSpy();
    });

    it('should not sign up an invalid customer', () => {
      const req = {
        body: {
          firstName: 'javier',
          password: 'test',
          confirmPassword: 'test',
        },
      };

      spyOn(customersService, 'signUp');
      spyOn(res, 'status').and.callThrough();

      customersController.signUp(req, res, next);

      expect(customersService.signUp).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should not sign up an existing customer', done => {
      const req = {
        body: {
          firstName: 'javier',
          lastName: 'ortiz',
          email: 'javier.ortizsaorin@gmail.com',
          password: 'test',
          confirmPassword: 'test',
        },
      };

      spyOn(customersService, 'signUp');
      spyOn(customersService, 'find').and.returnValue(
        Promise.resolve({
          results: [
            {
              id: 'id1',
              email: 'javier.ortizsaorin@gmail.com',
            },
          ],
        }),
      );
      spyOn(res, 'status').and.callThrough();

      customersController
        .signUp(req, res, next)
        .then(() => {
          expect(customersService.signUp).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
        })
        .then(done, done.fail);
    });

    it('should sign up a NOT existing customer', done => {
      const customer = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };
      const req = {
        body: customer,
      };

      spyOn(customersService, 'signUp').and.returnValue(
        Promise.resolve({
          customer: {
            id: 'id1',
            firstName: 'javier',
            lastName: 'ortiz',
            email: 'javier.ortizsaorin@gmail.com',
            password: '1234123djaddfadkadfnmñ',
          },
        }),
      );
      spyOn(customersService, 'find').and.returnValue(
        Promise.resolve({
          results: [],
        }),
      );

      customersController
        .signUp(req, res, next)
        .then(() => {
          expect(customersService.signUp).toHaveBeenCalledWith(customer);
          expect(res.json).toHaveBeenCalledWith({
            customer: {
              id: 'id1',
              firstName: 'javier',
              lastName: 'ortiz',
              email: 'javier.ortizsaorin@gmail.com',
              password: undefined,
            },
          });
        })
        .then(done, done.fail);
    });
  });
});

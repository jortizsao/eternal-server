import CustomersController from './customers.controller';
import CustomersService from '../customers.service';
import CustomersUtils from '../customers.utils';
import CommonsService from '../../commons/commons.service';
import JwtService from '../../../authorize/services/jwt.service';
import Config from '../../../config';
import Utils from '../../../utils';
import { httpResponse as res } from '../../../../spec/helpers/mocks';

describe('Customers', () => {
  describe('Controller', () => {
    const config = Config();
    const commercetools = {};
    const commonsService = CommonsService({ commercetools, entity: 'customers' });
    const customersService = CustomersService({
      commercetools,
      config,
      commonsService,
    });
    const utils = Utils();
    const customersUtils = CustomersUtils({ utils });
    const authorizeService = JwtService({ passphrase: 'passphrase', expiresIn: 86400 }); // 1 day
    const customersController = CustomersController({
      customersUtils,
      customersService,
      authorizeService,
    });
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
        title: 'mr',
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };
      const req = {
        body: customer,
      };
      const baseTime = new Date('1982-02-11T00:00:00.000Z');

      spyOn(customersService, 'signUp').and.returnValue(
        Promise.resolve({
          customer: {
            id: 'id1',
            title: 'mr',
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
      jasmine.clock().install();
      jasmine.clock().mockDate(baseTime);

      // JWT Token for the payload
      // {
      //   "id": "id1",
      //   "email": "javier.ortizsaorin@gmail.com",
      //   "iat": 382233600,
      //   "exp": 382320000
      // }
      customersController
        .signUp(req, res, next)
        .then(() => {
          expect(customersService.signUp).toHaveBeenCalledWith(customer);
          expect(res.json).toHaveBeenCalledWith({
            customer: {
              id: 'id1',
              title: 'mr',
              firstName: 'javier',
              lastName: 'ortiz',
              email: 'javier.ortizsaorin@gmail.com',
            },
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkMSIsImVtYWlsIjoiamF2aWVyLm9ydGl6c2FvcmluQGdtYWlsLmNvbSIsImlhdCI6MzgyMjMzNjAwLCJleHAiOjM4MjMyMDAwMH0.3maGqzyZRqsX0VOrlz-6ZhkWbh9XJC-UPJx9ctoSoO8',
          });
          jasmine.clock().uninstall();
        })
        .then(done, done.fail);
    });

    it('should sign in a customer', () => {
      const req1 = {
        user: undefined,
      };
      const baseTime = new Date('1982-02-11T00:00:00.000Z');
      jasmine.clock().install();
      jasmine.clock().mockDate(baseTime);

      customersController.signIn(req1, res);

      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(res.json).not.toHaveBeenCalled();

      const user = {
        id: 'id1',
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: '1234123djaddfadkadfnmñ',
      };

      const req2 = {
        user,
      };

      customersController.signIn(req2, res);

      // JWT Token for the payload
      // {
      //   "id": "id1",
      //   "email": "javier.ortizsaorin@gmail.com",
      //   "iat": 382233600,
      //   "exp": 382320000
      // }
      expect(res.json).toHaveBeenCalledWith({
        customer: {
          id: 'id1',
          firstName: 'javier',
          lastName: 'ortiz',
          email: 'javier.ortizsaorin@gmail.com',
        },
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImlkMSIsImVtYWlsIjoiamF2aWVyLm9ydGl6c2FvcmluQGdtYWlsLmNvbSIsImlhdCI6MzgyMjMzNjAwLCJleHAiOjM4MjMyMDAwMH0.3maGqzyZRqsX0VOrlz-6ZhkWbh9XJC-UPJx9ctoSoO8',
      });

      jasmine.clock().uninstall();
    });
  });
});

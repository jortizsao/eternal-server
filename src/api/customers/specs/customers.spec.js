import deepFreeze from 'deep-freeze';
import app from '../../../server';
import { ValidationError } from '../../../errors';
import customersControllerModule from '../customers.controller';

describe('Customers', () => {
  describe('Controller', () => {
    const customersController = customersControllerModule(app);

    it('should validate the required fields to sign up', () => {
      const customerWithoutAllFields = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      };

      const customerWithoutFirstName = {
        firstName: '',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      const customerWithoutLastName = {
        firstName: 'javier',
        lastName: '',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      const customerWithoutEmail = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: '',
        password: 'test',
        confirmPassword: 'test',
      };

      const customerWithoutPassword = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: '',
        confirmPassword: 'test',
      };

      const customerWithoutConfirmPassword = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: '',
      };

      const customerWithAllFields = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      expect(customersController.hasAllRequiredFields(customerWithoutAllFields)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithoutFirstName)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithoutLastName)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithoutEmail)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithoutPassword)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithoutConfirmPassword)).toBe(false);
      expect(customersController.hasAllRequiredFields(customerWithAllFields)).toBe(true);
    });

    it('should check that password and confirm password match', () => {
      const customerNotMatch = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test2',
      };

      const customerMatch = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      expect(customersController.passwordAndConfirmPasswordMatch(customerNotMatch)).toBe(false);
      expect(customersController.passwordAndConfirmPasswordMatch(customerMatch)).toBe(true);
    });

    it('should get the customer fields clean', () => {
      const customer = {
        firstName: '  javier  ',
        lastName: 'ortiz   ',
        email: ' javier.ortizsaorin@gmail.com   ',
        password: 'test ',
        confirmPassword: ' test',
      };

      const customerClean = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      deepFreeze(customer);

      expect(customersController.getCleanCustomer(customer)).toEqual(customerClean);
    });

    it('should check if customer is valid to register', () => {
      const validCustomer = {
        firstName: '   javier   ',
        lastName: '   ortiz       ',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      const expectedValidCustomer = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      deepFreeze(validCustomer);

      // prettier-ignore
      expect(customersController.getValidCustomerToRegister(validCustomer))
      .toEqual(expectedValidCustomer);

      const customerWithoutField = {
        firstName: 'javier',
        lastName: '',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      expect(() => {
        customersController.getValidCustomerToRegister(customerWithoutField);
      }).toThrow(new ValidationError('Please fill all required fields'));

      const customerPasswordsNotMatch = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test2',
      };

      expect(() => {
        customersController.getValidCustomerToRegister(customerPasswordsNotMatch);
      }).toThrow(new ValidationError("Passwords fields don't match"));
    });
  });
});

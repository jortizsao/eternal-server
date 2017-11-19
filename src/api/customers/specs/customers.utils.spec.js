import deepFreeze from 'deep-freeze';
import { ValidationError } from '../../../errors';
import CustomersUtils from '../customers.utils';
import Utils from '../../../utils';

describe('Customers', () => {
  describe('Utils', () => {
    const utils = Utils();
    const customersUtils = CustomersUtils({ utils });

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

      expect(customersUtils.hasAllRequiredFields(customerWithoutAllFields)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithoutFirstName)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithoutLastName)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithoutEmail)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithoutPassword)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithoutConfirmPassword)).toBe(false);
      expect(customersUtils.hasAllRequiredFields(customerWithAllFields)).toBe(true);
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

      expect(customersUtils.passwordAndConfirmPasswordMatch(customerNotMatch)).toBe(false);
      expect(customersUtils.passwordAndConfirmPasswordMatch(customerMatch)).toBe(true);
    });

    it('should get the customer fields cleaned', () => {
      const customer = {
        firstName: '  javier  ',
        lastName: 'ortiz   ',
        email: ' javier.ortizsaorin@gmail.com   ',
        password: 'test ',
        confirmPassword: ' test',
      };

      const cleanedCustomer = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      deepFreeze(customer);

      expect(customersUtils.getCleanedCustomer(customer)).toEqual(cleanedCustomer);
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

      expect(customersUtils.getValidCustomerToRegister(validCustomer)).toEqual(
        expectedValidCustomer,
      );

      const customerWithoutField = {
        firstName: 'javier',
        lastName: '',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test',
      };

      expect(() => {
        customersUtils.getValidCustomerToRegister(customerWithoutField);
      }).toThrow(new ValidationError('Please fill all required fields'));

      const customerPasswordsNotMatch = {
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        confirmPassword: 'test2',
      };

      expect(() => {
        customersUtils.getValidCustomerToRegister(customerPasswordsNotMatch);
      }).toThrow(new ValidationError("Passwords fields don't match"));
    });

    it('should get the token payload from the customer', () => {
      const customer = {
        id: 'id1',
        firstName: 'javier',
        lastName: 'ortiz',
        email: 'javier.ortizsaorin@gmail.com',
        password: 'test',
        addresses: [],
        customerNumber: 'cust1',
      };

      expect(customersUtils.getTokenPayload(customer)).toEqual({
        id: 'id1',
        email: 'javier.ortizsaorin@gmail.com',
      });
    });
  });
});

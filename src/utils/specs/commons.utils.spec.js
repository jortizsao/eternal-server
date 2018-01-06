import { ValidationError } from '../../errors';
import commonsUtils from '../commons';

describe('Commons Utils', () => {
  it('should transform all string fields to lower case', () => {
    const customer = {
      firstName: 'Javier',
      lastName: 'Ortiz Saorin',
      email: 'JAVIER.ORTIZSAORIN@GMAIL.COM',
      customerNumber: 1,
    };

    const expectedCustomer = {
      firstName: 'javier',
      lastName: 'ortiz saorin',
      email: 'javier.ortizsaorin@gmail.com',
      customerNumber: 1,
    };

    expect(commonsUtils.fieldsToLowerCase(customer)).toEqual(expectedCustomer);
  });

  describe('when checking the address required fields', () => {
    describe('when the address has all required fields', () => {
      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        city: 'valencia',
        postalCode: '46003',
        country: 'spain',
      };

      it('should NOT throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).not.toThrow();
      });
    });

    describe('when the address does not have first name', () => {
      const address = {
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        city: 'valencia',
        postalCode: '46003',
        country: 'spain',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"firstName" is required');
      });
    });

    describe('when the address does not have last name', () => {
      const address = {
        firstName: 'javier',
        streetName: 'plaza de la reina',
        city: 'valencia',
        postalCode: '46003',
        country: 'spain',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"lastName" is required');
      });
    });

    describe('when the address does not have street name', () => {
      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        city: 'valencia',
        postalCode: '46003',
        country: 'spain',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"streetName" is required');
      });
    });

    describe('when the address does not have city', () => {
      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        postalCode: '46003',
        country: 'spain',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"city" is required');
      });
    });

    describe('when the address does not have postal code', () => {
      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        city: 'valencia',
        country: 'spain',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"postalCode" is required');
      });
    });

    describe('when the address does not have country', () => {
      const address = {
        firstName: 'javier',
        lastName: 'ortiz saorin',
        streetName: 'plaza de la reina',
        postalCode: '46003',
        city: 'valencia',
      };

      it('should throw a ValidationError', () => {
        expect(() => {
          commonsUtils.checkIfAddressHasRequiredFields(address);
        }).toThrowError(ValidationError, '"country" is required');
      });
    });
  });
});

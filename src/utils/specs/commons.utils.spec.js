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
});

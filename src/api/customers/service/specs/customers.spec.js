import Customers from '../index';
import Utils from '../../../../utils';
import { NotAuthorizedError, NotAuthenticatedError } from '../../../../errors';

describe('Customers', () => {
  const utils = Utils();
  const commercetools = {};
  const customers = Customers({ utils, commercetools });

  describe('when securing a function', () => {
    let cb;
    let id;
    let authUser;
    let securedFn;

    beforeEach(() => {
      cb = jasmine.createSpy();
      securedFn = customers.secured(cb);
    });

    describe('when the user is not authenticated', () => {
      beforeEach(() => {
        id = 'id1';
        authUser = undefined;
      });

      it('should throw a "NotAuthenticatedError"', done => {
        securedFn(id, { authUser })
          .then(() => {
            throw new Error('This promise should not have been resolved');
          })
          .catch(err => {
            expect(err instanceof NotAuthenticatedError).toBe(true);
          })
          .then(done, done.fail);
      });

      it('should not call the callback function', done => {
        securedFn(id, { authUser })
          .then(() => {
            throw new Error('This promise should not have been resolved');
          })
          .catch(() => {
            expect(cb).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });
    });

    describe('when the user is not authorized', () => {
      beforeEach(() => {
        id = 'id1';
        authUser = { id: 'id2' };
      });

      it('should throw a "NotAuthorizedError"', done => {
        securedFn(id, { authUser })
          .then(() => {
            throw new Error('This promise should not have been resolved');
          })
          .catch(err => {
            expect(err instanceof NotAuthorizedError).toBe(true);
          })
          .then(done, done.fail);
      });

      it('should not call the callback function', done => {
        securedFn(id, { authUser })
          .then(() => {
            throw new Error('This promise should not have been resolved');
          })
          .catch(() => {
            expect(cb).not.toHaveBeenCalled();
          })
          .then(done, done.fail);
      });
    });

    describe('when the user is authenticated and authorized', () => {
      beforeEach(() => {
        id = 'id1';
        authUser = { id: 'id1' };
      });

      it('should call the callback function', done => {
        securedFn(id, 'otherparam', { authUser })
          .then(() => {
            expect(cb).toHaveBeenCalledWith(id, 'otherparam', { authUser });
          })
          .then(done, done.fail);
      });
    });
  });
});

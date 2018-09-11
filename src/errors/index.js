export class ValidationError extends Error {}
export class NotAuthorizedError extends Error {
  constructor(message) {
    super(message || 'not authorized');
  }
}
export class NotAuthenticatedError extends Error {
  constructor(message) {
    super(message || 'not authenticated');
  }
}
export class ConcurrencyError extends Error {
  constructor(message) {
    super(message || 'concurrency error. version mismatch');
  }
}

export class CommercetoolsError extends Error {
  constructor(err) {
    super(err.message || 'commercetools error');
    this.code = err.code;
    this.errors = err.body ? err.body.errors : undefined;
    this.originalError = err;
  }
}

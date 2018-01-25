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
export class OtherError extends Error {}

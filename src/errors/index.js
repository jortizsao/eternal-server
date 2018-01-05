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
export class OtherError extends Error {}

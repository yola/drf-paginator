export function PaginatorError(message) {
  this.name = 'PaginatorError';
  this.message = message || '';
  this.stack = (new Error()).stack;
}

PaginatorError.prototype = Object.create(Error.prototype);
PaginatorError.prototype.constructor = PaginatorError;

export default PaginatorError;

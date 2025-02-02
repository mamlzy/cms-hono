export class FetchError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'FetchError';
    this.status = status;

    // Ensure the prototype chain is correct for instanceof checks
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

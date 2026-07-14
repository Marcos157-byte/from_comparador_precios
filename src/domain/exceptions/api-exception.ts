export class ApiException extends Error {
  readonly statusCode: number | null;

  constructor(message: string, statusCode: number | null = null) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
  }
}

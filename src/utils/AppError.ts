export default class AppError extends Error {
  constructor(
    public message: string,
    public errorCode: string
  ) {
    super(message)
  }
}

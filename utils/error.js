class AppError extends Error {
  constructor ({ text = "internal", status = 500, message = false }) {
    super(`${text}_${status}${(!message) ? "" : "_"}${message}`);
  }
}

export default AppError

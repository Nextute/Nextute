const handleError = (res, status, message, errorCode = null) => {
  const response = { message };
  if (errorCode) response.errorCode = errorCode;
  res.status(status).json(response);
};

export { handleError };

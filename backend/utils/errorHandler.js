const handleError = (res, status, message, errorCode = null) => {
  const response = { status: false, message };
  
  if (errorCode) {
    response.errorCode = errorCode;
  }
  
  return res.status(status).json(response);
};

export { handleError };

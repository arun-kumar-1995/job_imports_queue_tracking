export const APIResponse = (res, http, message, data) => {
  const { code, status } = http;
  return res.status(code).json({
    success: true,
    message,
    status,
    httpCode: code,
    ...(data && { data }),
  });
};

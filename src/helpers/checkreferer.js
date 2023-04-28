const checkReferer = (req) => {
  const allowedReferer = "http://localhost:3000";
  const referer = req.headers.referer;

  if (!referer || !referer.startsWith(allowedReferer)) {
    return false;
  }
  return true;
};

export default checkReferer;

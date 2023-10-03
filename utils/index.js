export function getToken(req) {
  const { authorization } = req.headers;
  const token = authorization ? authorization.replace("Bearer", "") : null;
  return token && token.length ? token : null;
}

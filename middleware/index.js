export const bodyParser = (handler) => async (req, res) => {
  if (req.method === "POST" || req.method === "PUT") {
    // Parse the request body
    const body = JSON.parse(req.body);
    req.body = body;
  }

  // Call the API route handler
  return handler(req, res);
};

export const setHeaders = (handler) => async (req, res) => {
  // Set the headers
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization,Origin,X-Requested-With,Content-Type,Accept"
  );

  // Call the API route handler
  return handler(req, res);
};

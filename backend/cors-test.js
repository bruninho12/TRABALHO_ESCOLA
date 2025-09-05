// CORS test file
const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration - simple version that allows all origins
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Simple test endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CORS test successful",
    time: new Date().toISOString(),
  });
});

// Test endpoint with CORS headers manually set
app.options("/cors-test", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
  );
  res.sendStatus(200);
});

app.get("/cors-test", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, Accept"
  );

  res.json({
    success: true,
    message: "CORS test with explicit headers successful",
    time: new Date().toISOString(),
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,PUT,POST,DELETE,OPTIONS",
      "access-control-allow-headers":
        "Content-Type, Authorization, Content-Length, X-Requested-With, Accept",
    },
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`CORS test server running on port ${PORT}`);
});

module.exports = app;

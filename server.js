require("dotenv").config();
const express = require("express");
const path = require("path");
const apiApp = require("./api/index");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname)));
app.use(apiApp);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Local Server running at http://localhost:${PORT}`);
});

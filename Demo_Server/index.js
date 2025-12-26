const express = require("express");
const app = express();
const port = 5001;
const { aadhaar_data, pan_data, cibil_data } = require("./data");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/aadhaar", (req, res) => {
  const aadhaarNumber = req.query.aadhaar_number;
  if (!aadhaarNumber) {
    return res
      .status(400)
      .json({ error: "aadhaar_number is required as a query parameter" });
  }

  const data = aadhaar_data.find(
    (item) =>
      item.aadhaar_number.replace(/-/g, "") == aadhaarNumber.replace(/-/g, "")
  );
  if (!data) {
    return res.status(404).json({ error: "Aadhaar record not found" });
  }

  res.json(data);
});

app.get("/pan", (req, res) => {
  const panNumber = req.query.pan;
  if (!panNumber) {
    return res
      .status(400)
      .json({ error: "pan is required as a query parameter" });
  }

  const data = pan_data.find((item) => item.pan === panNumber);
  if (!data) {
    return res.status(404).json({ error: "PAN record not found" });
  }

  res.json(data);
});

app.get("/cibil", (req, res) => {
  const panNumber = req.query.pan;
  if (!panNumber) {
    return res
      .status(400)
      .json({ error: "pan is required as a query parameter" });
  }

  const data = cibil_data.find((item) => item.income_tax_id === panNumber);
  if (!data) {
    return res.status(404).json({ error: "CIBIL record not found" });
  }

  res.json(data);
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  res.send("Data Received!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

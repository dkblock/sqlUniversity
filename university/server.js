const express = require("express");
const app = express();
const dbConfig = {
  server: "DESKTOP-MFH3UBT",
  database: "University",
  user: "TestUser",
  password: "test",
};
let isSuccess;

app.get("/tables", async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");

  const query = `SELECT TABLE_NAME FROM ${dbConfig.database}.INFORMATION_SCHEMA.TABLES`;
  const result = await getData(query);
  res.send(result);
});

app.get("/", async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  const result = await getData(req.query.query);
  res.send(result);
});

app.listen(5050, function () {
  console.log("Server is working!");
});

const sql = require("mssql");
async function getData(query) {
  try {
    console.log(query);
    await sql.connect(dbConfig);
    const result = await sql.query(query);
    isSuccess = true;

    return result;
  } catch (err) {
    console.log(err);
    isSuccess = false;

    if (err.precedingErrors.length)
      return {
        error: err.precedingErrors[0].originalError.message,
        status: 500,
      };

    return {
      error: err.originalError.info.message,
      status: 500,
    };
  }
}

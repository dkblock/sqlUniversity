const express = require("express");
const app = express();
const dbConfig = {
    server: "DESKTOP-MFH3UBT",
    database: "University",
    user: "TestUser",
    password: "test"
}

app.get('/tables', async function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');;

    const query = `SELECT TABLE_NAME FROM ${dbConfig.database}.INFORMATION_SCHEMA.TABLES`
    const result = await getData(query);
    res.send(result);
})

app.get('/', async function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');;
    const result = await getData(req.query.query);
    res.send(result);
})

app.listen(5050, function () {
    console.log("Server is working!");
})

const sql = require("mssql/msnodesqlv8")
async function getData(query) {
    try {
        console.log(query);
        await sql.connect(dbConfig);
        const result = await sql.query(query);
        return result;
    } catch (err) {
        return err;
    }
}
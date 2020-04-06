const express = require("express");
const app = express();
const mysqlDB = require("./module/module")
const port = 3000;

app.use(express.static('dist'))

app.listen(port, () => console.log(`Server run in port ${port}`))
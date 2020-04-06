const express = require("express");
const app = express();
const mysqlDB = require("./module")
const port = 3000;



app.listen(port, () => console.log(`Server run in port ${port}`))
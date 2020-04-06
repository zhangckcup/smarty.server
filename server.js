const express = require("express");
const app = express();
const mysqlDB = require("./module")
const port = 3000;

mysqlDB.query("SELECT * from users where user", (err, row, fields) => {
  if(err){
    console.error(err)
  }

})

app.listen(port, () => console.log(`Server run in port ${port}`))
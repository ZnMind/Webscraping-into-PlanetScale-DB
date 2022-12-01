require('dotenv').config();
const express = require('express');
const app = express();

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect()
app.use(express.json())

app.get('/:winner?', (req, res) => {
  let winner = req.params.winner;
  console.log(winner)
  connection.query(`select * from lcs where first_team = ?`, [winner], function(err, results, fields) {
    if (err) throw err
    res.send(results);
  })
})

app.post('/', (req, res) => {
  let body = req.body.games;
  console.log(body);
  
  connection.query(`insert into lcs (year, split, first_team, first_result, second_result, second_team) values ?`, [body], function(err, rows, fields) {
    if (err) throw err
    res.send(rows);
  })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

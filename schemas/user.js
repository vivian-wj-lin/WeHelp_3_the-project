require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const S3 = require("aws-sdk/clients/s3")
const AWS = require("aws-sdk")
const mysql2 = require("mysql2")
const pool = mysql2.createPool({
  host: process.env.AWS_Mysql_Host,
  user: process.env.AWS_Mysql_User,
  password: process.env.AWS_Mysql_Password,
  database: "twitter_clone",
  port: 3306,
})

const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "200mb" }))

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack)
    return
  }
  // console.log("Connected to MySQL as id " + connection.threadId)
})

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack)
    return
  }

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user (
      user_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      profilePic varchar(10000) DEFAULT"https://msg-board-s3-bucket.s3.ap-northeast-1.amazonaws.com/msgboard/profilePic.jpeg"
    );
  `

  connection.query(createTableQuery, (error, results) => {
    if (error) {
      console.error("Error creating table: " + error.stack)
      return
    }
    console.log("User table created/runs successfully.")
  })

  connection.release()
})

module.exports = { userPool: pool }

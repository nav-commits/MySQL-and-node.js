const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config()
const port = process.env.PORT || 3000;

// enviorment varibles
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;


// parsing data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());

// static files
app.use('/static',express.static('public'));


// database connnection 
const con = mysql.createConnection({
    host: "localhost",
    user: `${username}`,
    password: `${password}`,
    database: `${database}`,
  });

  con.connect((err)=> {
    if (err) {
        console.log(err)
    }
    console.log("Connected to mysql!");
  });

   // database created
  app.get('/usersdata', (req,res)=>{
    const sql = 'CREATE DATABASE usersdb';
    con.query(sql, (err, result)=>{
        if(err){
           return console.log(err);
        }
       else{
           console.log(result);
            res.send('database created');
       }
    });
});


// APIS

// all users
app.get('/users', (req,res)=>{
    let sql = 'SELECT * FROM users';
    con.query(sql,(err, result)=>{
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
   });
 })

 // get by id
 app.get('/users/:id', (req,res)=>{
    let id = req.params.id;
    con.query('SELECT * FROM users where id=?',id,(err, result)=>{
        if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
   });
 })

  // inserted data
  app.post('/users', (req,res)=>{
    let data = {title: req.body.title, name: req.body.name};
    let sql = "INSERT INTO users SET ?";
      con.query(sql, data,(err, results) => {
      if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
  })

  // update one
  app.put('/users/:id', (req,res)=>{
    let id = req.body.id;
    let name = req.body.name;
     let title = req.body.title;
    con.query('UPDATE users SET name = ?, title = ? WHERE id = ?',[name,title,id],(err, result)=>{
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
  
   });
 })

// delete all users
app.delete('/users', (req,res)=>{
    let sql = 'DELETE FROM users';
    con.query(sql,(err, result)=>{
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
   });
});

// delete by id
app.delete('/users/:id', (req,res)=>{
    let id = req.params.id;
    con.query('DELETE FROM users WHERE id = ?',id,(err, result)=>{
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": result}));
   });
});

app.listen(port);
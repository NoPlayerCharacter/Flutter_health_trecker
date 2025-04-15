import http from 'http';
import mysql from 'mysql2';

const db = mysql.createConnection({ host: "localhost", user:"root", database: "openapi", password: ""})

const server = http.createServer((req, res) =>{
    res.writeHead(200,{ 'content-type': 'text/plain'});
    res.end()
})
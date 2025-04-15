import express from 'express';
import mysql from 'mysql2';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml'; 

const swaggerDocument = YAML.parse(fs.readFileSync('./openapi/spec.yaml', 'utf8'));


const db = mysql.createConnection({ host: "localhost", user:"root", database: "health_trecker", password: ""})
const app = express();
app.use(express.json()); 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users', (req, res) => {
    db.query('SELECT * FROM tb_user', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });

  app.post('/users', (req, res) => {
  const { nama, email, password } = req.body;
   db.query('INSERT INTO tb_user (nama, email, password) VALUES (?, ?, ?)', 
      [nama, email, password], 
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id_user: result.insertId, nama, email });
      }
    );
  });

  app.get('/traineers', (req, res) => {
    db.query('SELECT * FROM tb_traineer', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  
  app.post('/traineers', (req, res) => {
    const { nama, spesialis, email, password } = req.body;
    db.query('INSERT INTO tb_traineer (nama, spesialis, email, password) VALUES (?, ?, ?, ?)', 
      [nama, spesialis, email, password], 
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id_traineer: result.insertId, nama, spesialis });
      }
    );
  });
  
  app.get('/jadwal', (req, res) => {
    db.query('SELECT * FROM tb_jadwal', (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
  
  app.post('/jadwal', (req, res) => {
    const { id_user, id_traineer, tanggal, waktu, jenis_latihan } = req.body;
    db.query(`INSERT INTO tb_jadwal (id_user, id_traineer, tanggal, waktu, jenis_latihan) 
              VALUES (?, ?, ?, ?, ?)`, 
      [id_user, id_traineer, tanggal, waktu, jenis_latihan],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id_jadwal: result.insertId });
      }
    );
  });  

  app.listen(3000, () => console.log('server berjalan di http://localhost:3000'));
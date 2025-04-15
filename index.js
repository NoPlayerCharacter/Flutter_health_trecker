import express from 'express';
import mysql from 'mysql2';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const swaggerDocument = YAML.parse(fs.readFileSync('./user-api.yaml', 'utf8'));

const db = mysql.createConnection({ host: "localhost", user:"root", database: "healthy tracker", password: ""});
const app = express();
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- User Routes ---

// Get all users
app.get('/users', (req, res) => {
  db.query('SELECT id_user, nama, email FROM tb_user', (err, results) => {
    if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { nama, email, password } = req.body;
  db.query('INSERT INTO tb_user (nama, email, password) VALUES (?, ?, ?)',
    [nama, email, password],
    (err, result) => {
      if (err) {
        console.error("Error creating user:", err);
        return res.status(500).send(err);
    }
      res.status(201).json({ id_user: result.insertId, nama, email });
    }
  );
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  db.query('SELECT id_user, nama, email FROM tb_user WHERE id_user = ?', [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { nama, email, password } = req.body;
  db.query('UPDATE tb_user SET nama = ?, email = ?, password = ? WHERE id_user = ?',
    [nama, email, password, userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully', id_user: userId, nama, email });
    }
  );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  db.query('DELETE FROM tb_user WHERE id_user = ?', [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  });
});

// --- Traineer Routes ---

// Get all traineers
app.get('/traineers', (req, res) => {
  db.query('SELECT id_traineer, nama, spesialis, email FROM tb_traineer', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new traineer
app.post('/traineers', (req, res) => {
  const { nama, spesialis, email, password } = req.body;
  db.query('INSERT INTO tb_traineer (nama, spesialis, email, password) VALUES (?, ?, ?, ?)',
    [nama, spesialis, email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id_traineer: result.insertId, nama, spesialis, email });
    }
  );
});

// Get a traineer by ID
app.get('/traineers/:id', (req, res) => {
  const traineerId = parseInt(req.params.id);
  db.query('SELECT id_traineer, nama, spesialis, email FROM tb_traineer WHERE id_traineer = ?', [traineerId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Traineer not found' });
    }
    res.json(results[0]);
  });
});

// Update a traineer
app.put('/traineers/:id', (req, res) => {
  const traineerId = parseInt(req.params.id);
  const { nama, spesialis, email, password } = req.body;
  db.query('UPDATE tb_traineer SET nama = ?, spesialis = ?, email = ?, password = ? WHERE id_traineer = ?',
    [nama, spesialis, email, password, traineerId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Traineer not found' });
      }
      res.json({ message: 'Traineer updated successfully', id_traineer: traineerId, nama, spesialis, email });
    }
  );
});

// Delete a traineer
app.delete('/traineers/:id', (req, res) => {
  const traineerId = parseInt(req.params.id);
  db.query('DELETE FROM tb_traineer WHERE id_traineer = ?', [traineerId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Traineer not found' });
    }
    res.status(204).send();
  });
});

// --- Jadwal Routes ---

// Get all jadwals
app.get('/jadwals', (req, res) => {
  db.query('SELECT id_jadwal, id_user, id_traineer, tanggal, waktu, jenis_latihan FROM tb_jadwal', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new jadwal
app.post('/jadwals', (req, res) => {
  const { id_user, id_traineer, tanggal, waktu, jenis_latihan } = req.body;
  db.query(`INSERT INTO tb_jadwal (id_user, id_traineer, tanggal, waktu, jenis_latihan)
              VALUES (?, ?, ?, ?, ?)`,
    [id_user, id_traineer, tanggal, waktu, jenis_latihan],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id_jadwal: result.insertId, id_user, id_traineer, tanggal, waktu, jenis_latihan });
    }
  );
});

// Get a jadwal by ID
app.get('/jadwals/:id', (req, res) => {
  const jadwalId = parseInt(req.params.id);
  db.query('SELECT id_jadwal, id_user, id_traineer, tanggal, waktu, jenis_latihan FROM tb_jadwal WHERE id_jadwal = ?', [jadwalId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Jadwal not found' });
    }
    res.json(results[0]);
  });
});

// Update a jadwal
app.put('/jadwals/:id', (req, res) => {
  const jadwalId = parseInt(req.params.id);
  const { id_user, id_traineer, tanggal, waktu, jenis_latihan } = req.body;
  db.query('UPDATE tb_jadwal SET id_user = ?, id_traineer = ?, tanggal = ?, waktu = ?, jenis_latihan = ? WHERE id_jadwal = ?',
    [id_user, id_traineer, tanggal, waktu, jenis_latihan, jadwalId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Jadwal not found' });
      }
      res.json({ message: 'Jadwal updated successfully', id_jadwal: jadwalId, id_user, id_traineer, tanggal, waktu, jenis_latihan });
    }
  );
});

// Delete a jadwal
app.delete('/jadwals/:id', (req, res) => {
  const jadwalId = parseInt(req.params.id);
  db.query('DELETE FROM tb_jadwal WHERE id_jadwal = ?', [jadwalId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Jadwal not found' });
    }
    res.status(204).send();
  });
});

// --- Minum Routes ---

// Get all minum entries
app.get('/minum', (req, res) => {
  db.query('SELECT id_minum, id_user, tanggal, waktu, jumlah_air FROM tb_minum', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new minum entry
app.post('/minum', (req, res) => {
  const { id_user, tanggal, waktu, jumlah_air } = req.body;
  db.query('INSERT INTO tb_minum (id_user, tanggal, waktu, jumlah_air) VALUES (?, ?, ?, ?)',
    [id_user, tanggal, waktu, jumlah_air],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id_minum: result.insertId, id_user, tanggal, waktu, jumlah_air });
    }
  );
});

// Get a minum entry by ID
app.get('/minum/:id', (req, res) => {
  const minumId = parseInt(req.params.id);
  db.query('SELECT id_minum, id_user, tanggal, waktu, jumlah_air FROM tb_minum WHERE id_minum = ?', [minumId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Minum entry not found' });
    }
    res.json(results[0]);
  });
});

// Update a minum entry
app.put('/minum/:id', (req, res) => {
  const minumId = parseInt(req.params.id);
  const { id_user, tanggal, waktu, jumlah_air } = req.body;
  db.query('UPDATE tb_minum SET id_user = ?, tanggal = ?, waktu = ?, jumlah_air = ? WHERE id_minum = ?',
    [id_user, tanggal, waktu, jumlah_air, minumId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Minum entry not found' });
      }
      res.json({ message: 'Minum entry updated successfully', id_minum: minumId, id_user, tanggal, waktu, jumlah_air });
    }
  );
});

// Delete a minum entry
app.delete('/minum/:id', (req, res) => {
  const minumId = parseInt(req.params.id);
  db.query('DELETE FROM tb_minum WHERE id_minum = ?', [minumId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Minum entry not found' });
    }
    res.status(204).send();
  });
});

// --- Progress Routes ---

// Get all progress entries
app.get('/progress', (req, res) => {
  db.query('SELECT id_progress, id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan FROM tb_progress', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a new progress entry
app.post('/progress', (req, res) => {
  const { id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan } = req.body;
  db.query('INSERT INTO tb_progress (id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan) VALUES (?, ?, ?, ?, ?, ?)',
    [id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id_progress: result.insertId, id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan });
    }
  );
});

// Get a progress entry by ID
app.get('/progress/:id', (req, res) => {
  const progressId = parseInt(req.params.id);
  db.query('SELECT id_progress, id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan FROM tb_progress WHERE id_progress = ?', [progressId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }
    res.json(results[0]);
  });
});

// Update a progress entry
app.put('/progress/:id', (req, res) => {
  const progressId = parseInt(req.params.id);
  const { id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan } = req.body;
  db.query('UPDATE tb_progress SET id_user = ?, tanggal = ?, jumlah_langkah = ?, kalori_harian = ?, kalori_mingguan = ?, kalori_bulanan = ? WHERE id_progress = ?',
    [id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan, progressId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Progress entry not found' });
      }
      res.json({ message: 'Progress entry updated successfully', id_progress: progressId, id_user, tanggal, jumlah_langkah, kalori_harian, kalori_mingguan, kalori_bulanan });
    }
  );
});

// Delete a progress entry
app.delete('/progress/:id', (req, res) => {
  const progressId = parseInt(req.params.id);
  db.query('DELETE FROM tb_progress WHERE id_progress = ?', [progressId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Progress entry not found' });
      }
      res.status(204).send();
    });
  });
  
  app.listen(3000, () => console.log('server berjalan di http://localhost:3000'));
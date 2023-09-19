const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

// Apka działa na serwerz
const app = express();
const port = 8000;

// Middleware do parsowania danych JSON
app.use(express.json())

// Middleware cors
const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200,
  };
app.use(cors(corsOptions));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// Połączenie z bazą danych
const db = new sqlite3.Database('mydb.sqlite', (err) => {
  if (err) {
    console.error('Błąd podczas łączenia z bazą danych:', err.message);
  } else {
    console.log('Połączono z bazą danych SQLite.');
  }
});

// Utworzenie tabeli z node.js
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT,
      email TEXT
    )
  `);
});

// Obsługa żądań HTTP
app.get('/', (req, res) => {
  res.send('Serwer SQLite');
});


// Zapis do bazy danych 
app.post('/saveUser', async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
      await db.run(sql, [name, email]);
      console.log('Użytkownik został zapisany do bazy danych');
      res.json({ success: true });
    } catch (error) {
      console.error('Błąd podczas zapisywania użytkownika:', error.message);
      res.status(500).json({ error: 'Błąd podczas zapisywania użytkownika' });
    }
  });

// Odczyt danych:
app.get('/getUsers', async (req, res) => {
  try {
    const sql = 'SELECT * FROM users'; 
    const rows = await db.all(sql);
    res.json(rows); 
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error.message);
    res.status(500).json({ error: 'Błąd podczas pobierania danych' });
  }
});

  

// Uruchom serwer 
app.listen(port, () => {
  console.log(`Serwer jest uruchomiony na porcie ${port}`);
});

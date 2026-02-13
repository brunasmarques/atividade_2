const express = require('express');
const { Pool } = require('pg'); // Driver para conectar ao PostgreSQL
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Configuração da conexão com o banco da Tropoweb
const pool = new Pool({
  user: 'alunos',
  host: 'benserverplex.ddns.net',
  database: 'web_03ta',
  password: 'senhaAlunos',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// ROTA PARA LISTAR (GET) - Agora busca na tabela livrosBru
app.get('/livros', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM livrosBru ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ROTA PARA CADASTRAR (POST) - Agora salva na tabela livrosBru
app.post('/livros', async (req, res) => {
  const { titulo, autor, paginas, genero } = req.body;
  try {
    const sql = 'INSERT INTO livrosBru (titulo, autor, paginas, genero) VALUES ($1, $2, $3, $4) RETURNING *';
    const valores = [titulo, autor, paginas, genero];
    const resultado = await pool.query(sql, valores);
    res.json({ mensagem: 'Livro salvo na tabela livrosBru!', livro: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✓ Servidor conectado ao banco web_03ta`);
  console.log(`✓ Rodando em http://localhost:${PORT}`);
});
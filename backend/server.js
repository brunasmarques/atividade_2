const express = require('express')
const { Pool } = require('pg')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

// conexão com banco do professor
const pool = new Pool({
  user: 'alunos',
  host: 'benserverplex.ddns.net',
  database: 'web_03ta',
  password: 'senhaAlunos',
  port: 5432,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000
})

// testa conexão
pool.connect()
  .then(() => console.log("✓ Banco conectado com sucesso"))
  .catch(err => console.log("✗ Erro ao conectar no banco:", err.message))

// rota teste
app.get('/', (req, res) => {
  res.send("Servidor funcionando!")
})


// LISTAR produtos
app.get('/produtos', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM produtos_bruna ORDER BY id DESC'
    )
    res.json(resultado.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: err.message })
  }
})


// CADASTRAR produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, estoque } = req.body

  try {
    const resultado = await pool.query(
      'INSERT INTO produtos_bruna (nome, descricao, preco, estoque) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, descricao, preco, estoque]
    )

    res.json({
      mensagem: "Produto cadastrado com sucesso",
      produto: resultado.rows[0]
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: err.message })
  }
})


// DELETAR produto
app.delete('/produtos/:id', async (req, res) => {
  const id = req.params.id

  try {
    await pool.query(
      'DELETE FROM produtos_bruna WHERE id = $1',
      [id]
    )

    res.json({
      mensagem: "Produto deletado com sucesso"
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: err.message })
  }
})


// iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`)
})
const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const listUsers = [
  {
    username: "Luc",
    _id: "61204ee9f5860e05a3652gfg",
    log: [
      {
        description: "tarea de prueba",
        duration: 3,
        date: "Wed Mar 05 2025"
      },
      {
        description: "tarea de prueba 2",
        duration: 7,
        date: "Tue Feb 04 2025"
      }
    ]
  },
  {
    username: "Tat",
    _id: "61204ee9f5860e05a3652ghj",
    log: [
      {
        description: "tarea de prueba",
        duration: 3,
        date: "Wed Mar 05 2025"
      },
      {
        description: "tarea de prueba 2",
        duration: 7,
        date: "Tue Feb 04 2025"
      }
    ]
  },
]

app.use(cors())
app.use(express.static('public'))
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const user = {
    username: req.body.username,
    _id: uuidv4()
  }
  res.json(user)
});

app.get('/api/users', (req, res) => {
  const users = [
    {
      username: "Luc",
      _id: uuidv4()
    },
    {
      username: "Tat",
      _id: uuidv4()
    },
  ]
  res.json(users)
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id
  const filterUser = listUsers.filter((user) => user._id === id)

  const userId = filterUser[0]._id
  const username = filterUser[0].username
  let date

  if(req.body.date) {
    date = new Date(req.body.date).toDateString()
  }else {
    date = new Date().toDateString()
  }
  
  const user = {
    _id: userId,
    username: username,
    date: date,
    duration: req.body.duration,
    description: req.body.description
  }
  console.log(user)
  res.json(user)
});

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id
  let filterUser = listUsers.filter((user) => user._id === id)
  res.json(filterUser)
  console.log(req.query.from)
  console.log(req.query.to)
  console.log(req.query.limit)
  // Agregar queries FROM y TO con formato YYYY-mm-dd y LIMIT
});
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

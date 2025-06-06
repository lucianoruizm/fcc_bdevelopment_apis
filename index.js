const express = require('express')
const app = express()
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

let listUsers = [
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
  const username = req.body.username
  
  const user = {
    username,
    _id: uuidv4()
  }
  listUsers.push(user)
  res.json(user)
});

app.get('/api/users', (req, res) => {
  res.json(listUsers)
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const userId = req.params._id
  let filterUser = listUsers.find((user) => user._id === userId)

  if (!filterUser) {
    return
  }

  let date

  if (req.body.date) {
    date = new Date(req.body.date).toDateString()
  } else {
    date = new Date().toDateString()
  }
  
  const newLog = {
    date,
    duration: parseInt(req.body.duration),
    description: req.body.description
  }

  if (!filterUser.log) {
    filterUser["log"] = [newLog]
  } else {
    filterUser.log.push(newLog)
  }

  const userNewLog = {
    username: filterUser.username,
    _id: filterUser._id,
    date,
    duration: parseInt(req.body.duration),
    description: req.body.description
  }

  res.json(userNewLog)
});

// Queries FROM y TO con formato YYYY-mm-dd (rangos de fechas) y LIMIT (logs)
app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id
  let filterUser = listUsers.find((user) => user._id === id)

  if (!filterUser) {
    return 
  }

  const count = filterUser.log.length
  filterUser.count = count
  
  const from = req.query.from ? new Date(req.query.from) : null
  const to = req.query.to ? new Date(req.query.to) : null
  const limit = req.query.limit ? parseInt(req.query.limit) : null

  let filteredLog = filterUser.log

  if (from && to) {
    console.log("FROM & TO")
    filteredLog = filteredLog.filter((log) => {
      return new Date(log.date) >= from && new Date(log.date) <= to
    })
  }

  if (from && !to) {
    console.log("From & !TO")
    filteredLog = filteredLog.filter((log) => new Date(log.date) >= from)
  }

  if (to && !from) {
    console.log("TO & !FROM")
    filteredLog = filteredLog.filter((log) => new Date(log.date) <= to)
  }

  if (limit) {
    console.log("LIMIT")
    filteredLog = filteredLog.slice(0, limit)
  }

  const filteredUser = {
    _id: filterUser._id,
    username: filterUser.username,
    count: filterUser.count,
    log: filteredLog
  }

  res.json(filteredUser)
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

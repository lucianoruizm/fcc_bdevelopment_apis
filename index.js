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
  const id = req.params._id
  const filterUser = listUsers.find((user) => user._id === id)
  console.log("Usuario filtrado: ", filterUser)

  const { log, ...rest } = filterUser
  console.log("FILTER USER: ", filterUser)

  let date

  if(req.body.date) {
    date = new Date(req.body.date).toDateString()
  }else {
    date = new Date().toDateString()
  }
  
  const newLog = {
    date,
    duration: parseInt(req.body.duration),
    description: req.body.description
  }

  const updateUser = {
    ...rest,
    log: log ? log.concat(newLog) : [newLog]
  }

  listUsers = listUsers.map(user => {
    if (user._id === updateUser._id) {
      return {
        updateUser,
      };
    }
    return user;
  });
  

  console.log("Usuario actualizado: ", updateUser)
  res.json(updateUser)
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

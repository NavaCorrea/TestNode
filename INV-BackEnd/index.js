
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const sqlite3 = require('sqlite3').verbose()

let dbFile = 'data/inventory_database.db'


//app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (request, response) => {
	response.json({ info: 'BackEnd de Test-Node by NavaCorrea' })
})



/** API */
app.get('/vehiculos', 
  (req, res, next) => {

    let db = new sqlite3.Database(dbFile);

    var sql = "select v.*, c.tipo from vehiculo v LEFT JOIN cat_tipo_vehiculo c ON c.id = v.id_tipo"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        // res.json({"message":"success","data":rows})
        res.json(rows)
      });

    db.close();
  }
)



/** API */
app.post('/vehiculos', 
  (req, res, next) => {

    let db = new sqlite3.Database(dbFile);

    var sql ='INSERT INTO vehiculo (id_tipo, numero_serie, modelo, color, num_llantas, potencia_motor) VALUES (?,?,?,?,?,?)'
    var params =[req.body.id_tipo, req.body.numero_serie, req.body.modelo, req.body.color, req.body.num_llantas, req.body.potencia_motor]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return
        }
        res.json({
            "message": "success",
            "id" : this.lastID
        })
    })

    db.close()
  }
)



app.listen(port, () => {
  console.log('App running on port: ', port)
})

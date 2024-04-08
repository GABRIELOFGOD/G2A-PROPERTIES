const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

// ===================== IMPORTING ROUTERS =========================== //
const ambassadorRouter = require('./routes/ambassador.router')
const realtorRouter = require('./routes/realtor.router')

// ================= CONFIGURATIONS ================== //
const databaseConnection = require('./config/database.config')
const app = express()

const PORT = process.env.PORT || 4200
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5174', '*'],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

databaseConnection()

app.use('/ambassador', ambassadorRouter)
app.use('/realtor', realtorRouter)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

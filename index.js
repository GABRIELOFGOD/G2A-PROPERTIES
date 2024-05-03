const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

// ===================== IMPORTING ROUTERS =========================== //
const ambassadorRouter = require('./routes/ambassador.router')
const realtorRouter = require('./routes/realtor.router')
const propertyRouter = require('./routes/property.router')
const newsletterRouter = require('./routes/newsletter.router')
const contactRouter = require('./routes/contact.router')
const adminRouter = require('./routes/administration.router')

// ================= CONFIGURATIONS ================== //
const databaseConnection = require('./config/database.config')
const app = express()

const PORT = process.env.PORT || 4200
app.use(cors({
  origin: ['https://g2arealestatecoach.com.ng', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

databaseConnection()

app.use('/ambassador', ambassadorRouter);
app.use('/realtor', realtorRouter);
app.use('/property', propertyRouter);
app.use('/newsletter', newsletterRouter);
app.use('/contact', contactRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

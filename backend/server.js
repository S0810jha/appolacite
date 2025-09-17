import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/admin.route.js'
import doctorRouter from './routes/doctor.route.js'
import userRouter from './routes/user.route.js'

// app config
const app = express()
const port = 8000

// connect database
connectDB()

// connect cloudinary
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

//listen on the port
app.listen(port, () => {
    console.log(`server is started on the port ${port}`)
})
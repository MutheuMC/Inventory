const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const componentsRouter = require('./routes/component')
const borrowRouter = require('./routes/borrow')
const notificationsRouter = require('./routes/notification')
const notificationRoutes = require('./routes/job'); // Adjust the path as necessary
const categoriesRouter = require('./routes/categories')


app.use(express.json())
app.use(cors())
app.use('/components', componentsRouter);
app.use('/borrow', borrowRouter)
app.use('/notifications', notificationsRouter)
app.use('/categories', categoriesRouter)
app.use('/job', notificationRoutes)






app.listen(process.env.PORT, ()=>{
    console.log(`Server started running on port ${process.env.PORT}`)
})

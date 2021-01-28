const express = require('express');
const mongoose = require('mongoose');
const config = require('config')
const router = require('./routes/auth.router');
const User = require('./model/User');
const cors =require('cors');


const app = express();
app.use(cors())
const PORT = config.get('port');
const MONGO_URI = config.get('mongoUrl');
app.use(express.json())
app.use('/authPage', router)


const start = async() => {
  try {
    await mongoose.connect(MONGO_URI, 
      { useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
       },
      () => console.log('hello from mongo'));
    app.listen(PORT, () => console.log('hello fro server'))
  } catch (e) {
    console.log(`Ошибка:${e.message}`);
  }
}

start()




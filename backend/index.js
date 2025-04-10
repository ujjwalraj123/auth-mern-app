const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const TaskRouter = require('./Routes/TaskRouter');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

// CORS Configuration
const corsOptions = {
  origin: [
    'https://auth-mern-app-rmhb.vercel.app', // Your frontend URL
    'http://localhost:3000' // Local development
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/tasks', TaskRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

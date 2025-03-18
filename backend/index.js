const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

// ✅ Define allowed frontend URLs
const allowedOrigins = [
    "https://auth-mern-app-rmhb.vercel.app", // ✅ Your frontend on Vercel
    "http://localhost:3000"  // ✅ Allow local development
];

// ✅ Configure CORS with allowed origins
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and authentication headers
}));

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// ✅ Apply Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});

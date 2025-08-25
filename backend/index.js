const express = require('express');
const dotenv = require('dotenv');
const ConnectDB = require('./db/ConnectDB');
const router = require('./routes/DBOperRoutes');
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

(async () => {
    const pool = await ConnectDB();

    // attach pool to each request
    app.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // use the routes
    app.use("/", router);

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
})();

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
    try {
      const pool = await ConnectDB();
  
      app.use((req, res, next) => {
        req.pool = pool;
        next();
      });
  
      app.use("/", router);
  
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (err) {
      console.error("❌ Failed to start server:", err);
      process.exit(1); 
    }
})();

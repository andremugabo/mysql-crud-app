const express = require("express");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const results = await req.pool.query(`SELECT * FROM ${process.env.DB_TABLENAME}`);
        res.json(results.rows); // use .rows for pg
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal server error");
    }
});

// Create a new user
router.post("/", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send("All fields are required");
    }

    try {
        // check if the user already exists
        const checkResult = await req.pool.query(
            `SELECT COUNT(*) FROM ${process.env.DB_TABLENAME} WHERE email = $1`,
            [email]
        );
        if (parseInt(checkResult.rows[0].count) > 0) {
            return res.status(409).send("User already exists");
        }

        // insert new user
        const insertResult = await req.pool.query(
            `INSERT INTO ${process.env.DB_TABLENAME} (name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        );

        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Internal server error");
    }
});

// Update a user
router.put("/", async (req, res) => {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
        return res.status(400).send("All fields are required");
    }

    try {
        const checkResult = await req.pool.query(
            `SELECT COUNT(*) FROM ${process.env.DB_TABLENAME} WHERE id = $1`,
            [id]
        );

        if (parseInt(checkResult.rows[0].count) === 0) {
            return res.status(404).send("User does not exist.");
        }

        const updateResult = await req.pool.query(
            `UPDATE ${process.env.DB_TABLENAME} SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
            [name, email, id]
        );

        res.status(200).json(updateResult.rows[0]);
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send("Internal server error");
    }
});

// Delete a user
router.delete("/", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("All fields are required");
    }

    try {
        const checkResult = await req.pool.query(
            `SELECT COUNT(*) FROM ${process.env.DB_TABLENAME} WHERE id = $1`,
            [id]
        );

        if (parseInt(checkResult.rows[0].count) === 0) {
            return res.status(404).send("User does not exist.");
        }

        await req.pool.query(`DELETE FROM ${process.env.DB_TABLENAME} WHERE id = $1`, [id]);
        res.status(200).send(`User with id ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;

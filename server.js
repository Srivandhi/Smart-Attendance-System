const express = require("express");
const path = require("path");
const app = express();

const timezone = "Asia/Kolkata";

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend

app.get("/api/card", (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).send("Missing name");
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", { timeZone: timezone });
    const dateString = now.toLocaleDateString("en-US", { timeZone: timezone });

    res.send(`Card holder name "${name}" is stored on ${dateString} at ${timeString}`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

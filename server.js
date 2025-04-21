const express = require('express');
const mqtt = require('mqtt');
const app = express();

// Connect to the MQTT broker using WebSocket over SSL/TLS (wss://)
const mqttClient = mqtt.connect('wss://broker.hivemq.com:8000/mqtt');

// Event listener when connected to the MQTT broker
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker via WebSocket (wss://)');
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static('public'));

// Handle POST request to submit card info
app.post('/submit', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    // Get the current date and time
    const date = new Date();
    const timeString = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
    const dateString = date.toISOString();

    // Publish the message to MQTT broker
    const message = JSON.stringify({
        name: name,
        date: dateString,
        time: timeString
    });

    mqttClient.publish('card-info', message, (err) => {
        if (err) {
            return res.status(500).send('Failed to publish message');
        }
        res.status(200).send('Card holder data submitted successfully');
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

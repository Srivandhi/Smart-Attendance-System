const express = require('express');
const app = express();
const mqtt = require('mqtt');

// Connect to the MQTT broker (e.g., HiveMQ public broker)
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

app.use(express.json());
app.use(express.static('public'));

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

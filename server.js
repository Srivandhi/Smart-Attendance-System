// Import libraries
const express = require('express');
const mqtt = require('mqtt');
const app = express();

// Correct MQTT connection URL
const mqttClient = mqtt.connect('mqtt://broker.mqtt.cool:1883', {
    clientId: "SmartAttendanceSystem-" + Math.random().toString(16).substr(2, 8),
    // username: '', // Optional
    // password: ''  // Optional
});

// When connected to MQTT Broker
mqttClient.on('connect', () => {
    console.log('✅ Connected to MQTT broker!');
    mqttClient.subscribe('card-info', (err) => {
        if (!err) {
            console.log('📡 Subscribed to topic: card-info');
        } else {
            console.error('❌ Failed to subscribe:', err);
        }
    });
});

// Listen for incoming MQTT messages
mqttClient.on('message', (topic, message) => {
    console.log(`📥 Message received on topic [${topic}]: ${message.toString()}`);
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static('public')); // If you have a public folder for frontend

// (Optional) HTTP POST endpoint if needed
app.post('/submit', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    const date = new Date();
    const timeString = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });
    const dateString = date.toISOString();

    const message = JSON.stringify({
        name: name,
        date: dateString,
        time: timeString
    });

    // Publish manually if needed (like from frontend POST request)
    mqttClient.publish('card-info', message, (err) => {
        if (err) {
            console.error('❌ Failed to publish MQTT message:', err);
            return res.status(500).send('Failed to publish message');
        }
        console.log('📤 Message published to MQTT: ', message);
        res.status(200).send('Card holder data submitted successfully');
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});

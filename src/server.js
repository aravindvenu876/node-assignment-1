const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Item = require('./models/Item');

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Inventory is Up & Running');
});

app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.status(201).json({ message: 'Item added', item: newItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
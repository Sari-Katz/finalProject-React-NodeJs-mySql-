const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const classRoute = require('./routes/classRoute');
const userSubscriptionRoute = require('./routes/userSubscriptionRoute');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use("/users", userRoute);
app.use("/classes", classRoute);
app.use("/userSubscription", userSubscriptionRoute);


app.use("/", (req, res) => {
    try {
        res.status(404).json("url is not found");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
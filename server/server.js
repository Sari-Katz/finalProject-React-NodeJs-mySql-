const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const userRoute = require('./routes/userRoute');
const classRoute = require('./routes/classRoute');
const subscriptionRoute = require('./routes/subscriptionRoute');
const chellangeRoute = require('./routes/chellangeRoute');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());

app.use("/users", userRoute);
app.use("/classes", classRoute);
app.use("/challenges",chellangeRoute );
app.use("/comments", commentRoute);
app.use("/posts", postRoute);
app.use("/subscription", subscriptionRoute);


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
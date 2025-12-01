const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const PORT = 5000;
const authRouter = require("./routes/authRoutes");
const bodyParser = require('body-parser');
const cors = require("cors");
const { notFound, errorHandler } = require('./middlewares/errorHandler');
// const { authMiddleware } = require('./middlewares/authMiddleware');
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/user', authRouter);
app.use(cookieParser());

app.use(notFound);
app.use(errorHandler);
// app.use(authMiddleware);

const startServer = async () => {
    try {
        await dbConnect();
        app.listen(PORT, ()=>{
            console.log(`Server is running at PORT ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
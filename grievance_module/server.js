require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require('./config/db_connection');
const logger = require('./config/app_logger');

//import routers
const grievanceRoute = require('./routes/grievance');


// /** import middlewares */
// const veriftAdmin = require("./middlewares/verifyAdminCred");
// const verifyCollector = require("./middlewares/collector/verifyCollectorCred");
/** middlewares */


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.disable('x-powered-by'); // less hackers know about our stack
app.enable('trust proxy'); // Trust the X-Forwarded-For header


const port = process.env.Port || 3001;

/** api routes */
app.use("/api/grievance", grievanceRoute);

/** start server only when we have valid connection */
connectDB().authenticate().then(() => {
    try {
        app.listen(port, () => {
            logger.info(`Server connected to --> ${port} Port`);
        })
    } catch (error) {
        logger.error(`Cannot connect to the server causing error ${error}`)
    }
}).catch(error => {
    logger.error(`Invalid database connection...! causing error ${error}`);
})
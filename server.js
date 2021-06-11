const express = require('express');
const app = express();
const logger = require("./logger");


app.use(function(error, req, res, next) {
    //console.log("MiddleWare running...")
    res.json({ message: error.message });
});

app.listen(5000, () => {
    logger.info('Express server is running on localhost:5000')
    logger.error("Something went wrong");
    logger.debug("This this Debug Log..");
});
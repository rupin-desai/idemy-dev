exports.loggerMiddleware = (req, res, next) => {
    const logEntry = {
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
        body: req.body,
        query: req.query,
        params: req.params,
    };

    console.log(JSON.stringify(logEntry, null, 2));
    next();
};
exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'An unexpected error occurred.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

exports.notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found.'
    });
};
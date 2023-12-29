const json = require('express')

function handleResponse(res, statusCode, message, data = null) {
    console.log(`Status: ${statusCode}, Message: ${json(message)}`);
    res.status(statusCode).json({ message, data})
}

function handleSuccess(res, statusCode, successMessage, data) {
    console.log(`Success: ${successMessage}`);
    handleResponse(res, statusCode, successMessage, data);
}

function handleError(res, statusCode, errorMessage) {
    console.error(`Error: ${errorMessage}`);
    handleResponse(res, statusCode, errorMessage);
}


exports.handleResponse = handleResponse;
exports.handleSuccess = handleSuccess;
exports.handleError = handleError;

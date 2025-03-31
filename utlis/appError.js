module.exports = (message, statusCode, statusText) => {
    let error = new Error();
    error.message = message;
    error.statusCode = statusCode;
    error.statusText = statusText;
    return error;
}
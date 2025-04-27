const caseInsensitive = (req, res, next) => {
    // Convert the URL path to lowercase
    req.url = req.url.toLowerCase();
    next();
};

module.exports = caseInsensitive; 
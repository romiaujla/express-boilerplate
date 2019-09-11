const logger = require('./logger');

validateBearerToken = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization').split(' ')[1];

    if(!authToken || authToken !== apiToken){
        // Logout error using winston
        logger.error(`Unauthorized request to path: ${req.path}`);

        // Return 401 for - Unauthorized Access
        return res
            .status(401)
            .json({
                error: `Unauthorized Access`
            });
    }
    next();
}

module.exports = validateBearerToken;


const { verifyToken } = require("../library/jwt");

module.exports = {
    checkAuth: async (req, res, next) => {
        try {
            const token = req.headers.token;
            const data = await verifyToken(token);
            req.authData = data;
            next();
        } catch (error) {
            next(error);
        }
    },
};

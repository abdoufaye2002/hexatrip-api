const { StatusCodes } = require("http-status-codes");

const authorizeMiddleware =
	(accessGrantedRoles = []) =>
	(req, res, next) => {
		if (accessGrantedRoles.length !== 0 && !accessGrantedRoles.includes(req.user.role)) {
			return res.status(StatusCodes.FORBIDDEN).send("Access refused");
		}
		next();
	};

module.exports = { authorizeMiddleware };

const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const multipleFilesUploaderMiddleware = (req, res, next) => {
	const uploader = req.app.locals.uploader;

	const multipleFileUploader = uploader.array("images", 10);

	multipleFileUploader(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
		} else if (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
		}
		next();
	});
};

module.exports = multipleFilesUploaderMiddleware;

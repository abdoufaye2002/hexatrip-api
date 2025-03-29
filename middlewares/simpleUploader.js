const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const singleFileUploaderMiddleware = (req, res, next) => {
	const uploader = req.app.locals.uploader;

	const singleFileUploader = uploader.single("image");

	singleFileUploader(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
		} else if (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
		}
		next();
	});
};

module.exports = singleFileUploaderMiddleware;

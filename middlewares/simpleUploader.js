const multer = require("multer");
const { StatusCodes } = require("http-status-codes");

const singleFileUploaderMiddleware = (req, res, next) => {
  const uploader = req.app.locals.uploader;

  uploader.single("image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      // Erreurs de Multer, comme une limite de taille dépassée
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    } else if (error) {
      // Autres erreurs
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
    next(); // Passe au middleware suivant si tout est OK
  });
};

module.exports = singleFileUploaderMiddleware;

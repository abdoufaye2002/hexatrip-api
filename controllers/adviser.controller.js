const StatusCodes = require("http-status-codes");
const Adviser = require("../models/Adviser");
const path = require("path");
const fs = require("fs").promises;

// Endpoints pour le front :
const getAll = async (req, res) => {
	try {
		const params = req.query;
		let formattedParams = {};
		if (params.town) {
			formattedParams.tags = { $regex: params.town, $options: "i" };
		}
		const advisers = await Adviser.find(formattedParams);
		return res.status(StatusCodes.OK).send(advisers);
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching advisers");
	}
};

const getOne = async (req, res) => {
	try {
		const { id } = req.params;
		const adviser = await Adviser.findById(id);
		if (!adviser) {
			return res.status(StatusCodes.BAD_REQUEST);
		}
		return res.status(StatusCodes.OK).send(adviser);
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error retrieving adviser");
	}
};

// Endpoints pour le postman :
const create = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
		}
		await Adviser.create(req.body);
		return res.status(StatusCodes.CREATED).send("Adviser created");
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Creation failed");
	}
};

const addImage = async (req, res) => {
	const { id } = req.params;
	const file = req.file;

	// Get out if no id :
	if (!id) {
		return res.status(StatusCodes.BAD_REQUEST).send("No id provided. Failure.");
	}

	// Fetch matching adviser :
	let adviser;
	try {
		adviser = await Adviser.findById(id);
		if (!adviser) {
			return res.status().send("No adviser found. Failure.");
		}
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error while fetching adviser. Failure.");
	}

	// Get out if something is wrong :
	if (!file || Object.keys(adviser).length === 0) {
		return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure.");
	}

	// Save image in the node fs, and attach it to the correct adviser in db :
	try {
		const uploadPath = path.join(__dirname, "../public/images/advisers", id, file.originalname);
		const directory = path.dirname(uploadPath);
		await fs.mkdir(directory, { recursive: true });
		await fs.writeFile(uploadPath, file.buffer);
		adviser.image = file.originalname;
		await adviser.save();
		return res.status(StatusCodes.CREATED).send("File attached successfully.");
	} catch (error) {
		console.log(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error : ${error}`);
	}
};

module.exports = { create, getAll, getOne, addImage };

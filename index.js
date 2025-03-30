const express = require("express");
const morgan = require("morgan");
const connectToDatabase = require("./database");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

// Generate key :
// const crypto = require("crypto");
// const randomKey = crypto.randomBytes(32).toString("hex");
// console.log(randomKey);

// routes :
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const { StatusCodes } = require("http-status-codes");

// instance :
const app = express();

// config :
const port = 3000;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
dotenv.config();
app.use(helmet()); // Global security
app.use(xssClean()); // Remove tags from incoming data
app.use(mongoSanitize({ replaceWith: "_" })); // Replace mongo operators $ and . by an underscore : Prevents mongo code injection

// rate limit config :
const limitOptions = {
	windowMs: 15 * 60 * 1000, // 15 mins
	max: 100, // max request per IP during the time window
	handler: (req, res) => {
		res.status(StatusCodes.TOO_MANY_REQUESTS).json({ status: 429, error: "Too many requests" });
	}, // Too many requests handler
	standardHeaders: true, // Add limit warnings as headers in response (use new ones not old ones)
	legacyHeaders: false,
};
app.use(rateLimit(limitOptions));

// cors config :
const allowedOrigins = ["https://hexatrip-front.netlify.app", "http://localhost:5173"];
const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			// Origin accepted
			callback(null, true);
		} else {
			// Origin not allowed
			callback(new Error("Not allowed by cors"));
		}
	}, // Check if request origin is allowed
	methods: ["GET", "POST", "PATCH", "DELETE"], // Only allow these methods
	allowedHeaders: ["Content-Type", "Authorization", "X-Forwarded-For"], // Only request with these headers
	credentials: true, // Allow cookies exchange/authentication headers
};
app.use(cors(corsOptions));

// connection to db :
connectToDatabase();

// config multer :
app.locals.uploader = multer({
	storage: multer.memoryStorage({}),
	limits: { fileSize: 10 * 1024 * 1024 }, // Max size : 10 Mb
	fileFilter: (req, file, cb) => {
		// Accept only images :
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Only images are accepted"));
		}
	},
});

// endpoints :
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/create-checkout-session", checkoutRoutes);

// catch all :
app.use((req, res) => {
	return res.status(404).send("Page not found");
});

// heartbeat :
app.listen(port, () => {
	console.log(`Hexatrip server running on port ${port}`);
});

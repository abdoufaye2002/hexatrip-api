const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcript = require("bcrypt")


const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Vérification des champs requis
        if (!username || !password || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all required fields!" });
        }

        // Vérifier si l'email existe déjà
        const userFounder = await User.findOne({ email });
        if (userFounder) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exists!" });
        }

        // Hachage du mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = {
            username,
            passwordHash,
            email
        };

        // Sauvegarde de l'utilisateur dans la base de données
        await User.create(user);

        // Réponse de succès
        res.status(StatusCodes.CREATED).send("User created");
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
    }
};
const login = (req,res)=>{

}

module.exports ={ register,login}
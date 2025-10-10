const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

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
            password: passwordHash,
            email
        };

        // Sauvegarde de l'utilisateur dans la base de données
        await User.create(user);

        // Réponse de succès
        res.status(StatusCodes.CREATED).send("User created");
    } catch (error) {
        console.log(error); s
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
    }
};
const login =async (req,res)=>{
    try {
        const {email,password}=req.body
         if (!password || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide all required fields!" });
        }
        const userFounder = await User.findOne({ email });
        if (!userFounder) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Account not found");
        }
        // check password
       const isMatch = await bcrypt.compare(password,userFounder.password)
       if(!isMatch){
         return res.status(StatusCodes.UNAUTHORIZED).send("Account not found");
       }
       //everything is fine , so we send data as a token to the user
       const jwtSecretKey = process.env.JWT_SECRET_KEY // Récupération de la clé secrète pour signer le token
       const token = jwt.sign({
        id:userFounder._id,
        username:userFounder.username,
        email:userFounder.email,
       },jwtSecretKey,{expiresIn: "1h"}) // Utilisation de la clé secrète et expiration du token dans 1 heure
       // strip userFound from the password
       const {password: _, __v, ...userWithoutSensitiveData} = userFounder._doc
       // Réponse de succès
        res.status(StatusCodes.OK).send({user:userWithoutSensitiveData,token});
    } catch (error) {
         console.log(`erreur in user login ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
    }
}

module.exports ={ register,login}
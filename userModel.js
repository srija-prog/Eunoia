
//defining the schema for the user model    
//import User from '../models/userModel.js'; 
//const router = express.Router();



const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePicture: {type: String, default: ""},
    bio: {type: String},
});
//here we define how the user will look in mongodb

const user = mongoose.model("user", userSchema);
export default user;
//here we made a model that will allow us to create, read, update and delete users in the database
//this is fun! yay!


import mongoose from 'mongoose';



//defining the schema for the post model
const postSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  //here the user references will be taken from the user model
  image: {type: String, required: true},
  //the image will be stored in the post content
  caption: {type: String, },
  //same for the caption
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  //it is an array of user IDs who liked the post
    comments: [{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    //here the user references will be taken from the user model
    text: {type: String, required: true},
    //the comment text
    createdAt: {type: Date, default: Date.now},
    //the date when the comment was commented, any comments on this comment ? lol!
  }],
  createdAt: {type: Date, default: Date.now},
  //the date when the post was created

});
const Post = mongoose.model('post', postSchema);
export default Post;
//exporting the post model to be used in other parts of the application

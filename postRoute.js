import express from 'express';
import Post from '../models/postModel.js'; // Import the Post model
const router = express.Router();

// --- CREATE A NEW POST ---
// POST /api/posts/
router.post("/", async (req, res) => {
    try {
        // Extract post data from the request body
        const { user, image, caption } = req.body;
        
        // Ensure required fields are present (user and image are required in the schema)
        if (!user || !image) {
            return res.status(400).json({ message: "User ID and image are required for a post." });
        }

        const newPost = new Post({
            user,
            image,
            caption
        });

        const savedPost = await newPost.save();
        // Respond with the newly created post
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create post.", error: error.message });
    }
});

// --- GET ALL POSTS (FEED) ---
// GET /api/posts/
router.get("/", async (req, res) => {
    try {
        // Find all posts and populate the 'user' field with user details
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate('user', 'username profilePicture'); // Only fetch username and profilePicture

        // Map to the shape expected by the frontend (author.username, content, createdAt)
        const response = posts.map((p) => ({
            author: {
                username: p.user?.username || 'Anonymous',
                profilePicture: p.user?.profilePicture || ''
            },
            content: p.caption || '',
            image: p.image || '',
            createdAt: p.createdAt
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve posts." });
    }
});

// --- GET POST BY ID ---
// GET /api/posts/:id
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture');
        
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve post." });
    }
});

// --- UPDATE POST ---
// PUT /api/posts/:id
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Basic authorization check (ideally this would be middleware)
        // This checks if the user making the request is the owner of the post.
        // if (post.user.toString() !== req.body.userId) { 
        //     return res.status(403).json({ message: "You can only update your own posts." });
        // }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body }, // Only update fields present in the request body
            { new: true }      // Return the updated document
        );
        
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update post." });
    }
});

// --- DELETE POST ---
// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Add authorization check here (e.g., if post.user.toString() !== req.body.userId)

        await Post.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete post." });
    }
});


export default router;

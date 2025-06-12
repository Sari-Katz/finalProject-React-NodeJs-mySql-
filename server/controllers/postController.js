const PostService = require('../services/postService');
// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.partialUpdatePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // הנתונים לעדכון מגיעים מגוף הבקשה
        const updatedPost = await postService.partialUpdatePostById(id, updates);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error patching post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await PostService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create new post
exports.createPost = async (req, res) => {
    try {
        const newPost = await PostService.createPost(req.body);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update post by ID
exports.updatePostById = async (req, res) => {
    try {
        const updatedPost = await PostService.updatePostById(req.params.id, req.body);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete post by ID
exports.deletePostById = async (req, res) => {
    try {
        const deleted = await PostService.deletePostById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
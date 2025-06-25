const commentService = require('../services/commentService');

exports.getAllComments = async (req, res) => {
    try {
        const comments = await commentService.getAllComments();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommentByPostId = async (req, res) => {
    try {
        const comment = await commentService.getCommentByPostId(req.params.postId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ error: 'Content must not be empty' });
        }
        const newComment = await commentService.createComment(req.body);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCommentById = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ error: 'Content must not be empty' });
        }
        const updated = await commentService.updateCommentById(req.params.id, content);
        if (!updated) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommentById = async (req, res) => {
    try {
        const deleted = await commentService.deleteCommentById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
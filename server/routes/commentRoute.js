const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', commentController.getAllComments);
router.post('/', commentController.createComment);
router.get('/:postId', commentController.getCommentByPostId);
router.put('/:id', commentController.updateCommentById);
router.delete('/:id', commentController.deleteCommentById);
router.patch('/:id', commentController.partialUpdateCommentById);

module.exports = router;
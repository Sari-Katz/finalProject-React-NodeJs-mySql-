const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.patch('/:id', postController.partialUpdatePostById);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePostById);
router.delete('/:id', postController.deletePostById);

module.exports = router;
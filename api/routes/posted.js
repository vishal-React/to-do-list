const express = require("express");
const {posts, updatePost, deletePost } = require("../controllers/posts.js");

const router = express.Router();

router.post("/posts", posts);
router.get('/posts', posts);
router.put('/update', updatePost);
router.delete('/delete', deletePost);


module.exports = router;

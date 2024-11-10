// const jwt = require('jsonwebtoken');
// const Post = require("../models/Post");

// const posts = async (req, res, next) => {
//   try {
//     // Get the token from cookies or headers
//     const token = req.cookies.access_token; // Adjust if using headers or other means

//     if (!token) {
//       return res.status(401).send("Unauthorized: No token provided");
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
//     const username = decoded.username; // Extract username from the decoded token

//     const { content } = req.body;
//     console.log("user", username);
//     console.log("content", content);

//     const newPost = new Post({
//       content: content,
//       username: username
//     });

//     await newPost.save();

//     res.status(200).send("Post has been created.");
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { posts };

const jwt = require('jsonwebtoken');
const Post = require("../models/Post");

const posts = async (req, res, next) => {
  try {
    // Get the token from cookies or headers
    const token = req.headers.authorization?.split(' ')[1];  // Extract token from Authorization header


    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
    const username = decoded.username; // Extract username from the decoded token
    const { title,content } = req.body;
    console.log("title",title,'content',content)
    if (req.method === "POST") {
      // Create a new post
      const newPost = new Post({
        title: title,
        content: content,
        username: username
      });

      await newPost.save();
      return res.status(200).json({ message: "Post has been created.", post: newPost }); 
    } else if (req.method === "GET") {
      // Read all posts for the particular user
      const userPosts = await Post.find({ username: username });
      return res.status(200).json(userPosts);
    } else {
      return res.status(405).send("Method Not Allowed");
    }
  } catch (err) {
    next(err);
  }
};

// Update a post (PUT)
const updatePost = async (req, res, next) => {
  try {
    // const token = req.cookies.access_token;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.access_token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const { postId, title, content } = req.body;
    
    const post = await Post.findById(postId);
    if (!post || post.username !== username) {
      return res.status(404).send("Post not found or unauthorized");
    }

    post.title = title;
    post.content = content;
    console.log('Updated Post:', post);
    await post.save();

    res.status(200).json({ message: "Post has been updated."}); 
  } catch (err) {
    next(err);
  }
};

// Delete a post (DELETE)
const deletePost = async (req, res, next) => {
  try {
    //const token = req.cookies.access_token;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.access_token;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post || post.username !== username) {
      return res.status(404).json({ message: "Post not found or unauthorized"});
    }

    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post has been deleted."});
  } catch (err) {
    next(err);
  }
};

module.exports = { posts, updatePost, deletePost };
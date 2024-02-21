const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const router = express.Router();
const { jwtAuth } = require("../middlewares/auth");
const ApiErrors = require("../utils/ApiError");
const Notify = require("../models/Notify");
const moment = require("moment");

//create post
router.post("/", jwtAuth, async (req, res, next) => {
  const { title, description, dueDate, category, pictures } = req.body;
  console.log(req.user);
  const id = req.user.payload.user._id;
  console.log(id);
  // const user = await User.findById(id);
  const newPost = new Post({
    owner: id,
    title,
    description,
    dueDate,
    category,
    pictures,
  });
  try {
    await newPost.save();
    const user = await User.findById(id);
    user.posts.push(newPost._id);
    await user.save();
    res.status(200).json(newPost);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

router.get("/status/chart", jwtAuth, async (req, res) => {
  try {
    const statusChartData = await Post.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("ok");
    res.json(statusChartData);
  } catch (error) {
    console.error("Error fetching status chart data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//update post
router.put("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, dueDate, category } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Cannot find user." });
    }
    post.title = title || post.title;
    post.description = description || post.description;
    post.category = category || post.category;
    post.dueDate = dueDate || post.dueDate;
    await post.save();
    console.log("update post ");
    res.status(200).json({ message: "Success.", updatedPost: post });
  } catch (e) {
    res.status(500).json({ message: "Error." });
  }
});

//get all posts
router.get("/", jwtAuth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });

    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

//get all number post

router.get("/numberpost", jwtAuth, async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "owner",
      strictPopulate: false,
    });
    const totalPosts = await Post.countDocuments();
    res.status(200).json(totalPosts);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

//get all number completed post
router.get("/completed/count", jwtAuth, async (req, res) => {
  try {
    const completedPostsCount = await Post.countDocuments({
      status: "COMPLETE",
    });

    res.status(200).json(completedPostsCount);
  } catch (error) {
    console.error("Error fetching completed posts count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all number found posts
router.get("/found/count", jwtAuth, async (req, res) => {
  try {
    const foundPostsCount = await Post.countDocuments({ category: "FOUND" });

    res.status(200).json(foundPostsCount);
  } catch (error) {
    console.error("Error fetching completed posts count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all number lost posts

router.get("/lost/count", jwtAuth, async (req, res) => {
  try {
    const lostPostsCount = await Post.countDocuments({ category: "LOST" });

    res.status(200).json(lostPostsCount);
  } catch (error) {
    console.error("Error fetching completed posts count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all found posts
router.get("/foundposts", jwtAuth, async (req, res) => {
  try {
    const foundPosts = await Post.find({ category: "FOUND" })
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });

    res.status(200).json(foundPosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});
//get all lost posts
router.get("/lostposts", jwtAuth, async (req, res) => {
  try {
    const lostPosts = await Post.find({ category: "LOST" })
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });
    res.status(200).json(lostPosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//get number posts in day

router.get("/day", jwtAuth, async (req, res) => {
  try {
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lấy ngày bắt đầu của ngày hiện tại
    const startOfDay = moment(currentDate).startOf("day").toDate();

    // Lấy ngày kết thúc của ngày hiện tại
    const endOfDay = moment(currentDate).endOf("day").toDate();

    // Tìm các bài viết được đăng trong khoảng thời gian từ startOfDay đến endOfDay
    const postsInDay = await Post.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate({
      path: "owner",
      strictPopulate: false,
    });

    const totalPostsInDay = postsInDay.length;

    res.status(200).json(totalPostsInDay);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

//get all post in week

router.get("/week", jwtAuth, async (req, res) => {
  try {
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Lấy ngày bắt đầu của tuần hiện tại
    const startOfWeek = moment(currentDate).startOf("week").toDate();

    // Lấy ngày kết thúc của tuần hiện tại
    const endOfWeek = moment(currentDate).endOf("week").toDate();

    // Tìm các bài viết được đăng trong khoảng thời gian từ startOfWeek đến endOfWeek
    const postsInWeek = await Post.find({
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate({
      path: "owner",
      strictPopulate: false,
    });

    const totalPostsInWeek = postsInWeek.length;

    res.status(200).json(totalPostsInWeek);
  } catch (e) {
    res.status(404).json(e.message);
  }
});

//get all user post
router.get("/mypost", jwtAuth, async (req, res) => {
  const id = req.user.payload.user._id;
  try {
    const myPosts = await Post.find({ owner: id }).populate({
      path: "owner",
      strictPopulate: false,
    });
    res.status(200).json(myPosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//get all available post
router.get("/available", jwtAuth, async (req, res) => {
  try {
    const availablePosts = await Post.find({ status: "AVAILABLE" })
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });

    res.status(200).json(availablePosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//get all complete post
router.get("/complete", jwtAuth, async (req, res) => {
  try {
    const completePosts = await Post.find({ status: "COMPLETE" })
      .populate({
        path: "owner",
        strictPopulate: false,
      })
      .sort({ createdAt: 1 });

    res.status(200).json(completePosts);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

// update status
router.patch("/updatestatus/:postId", jwtAuth, async (req, res) => {
  try {
    const userId = req.user.payload.user._id;
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId, owner: userId });
    if (!post) {
      return res.status(403).json({ message: "don't have permission" });
    }
    post.status = "COMPLETE";
    console.log("update success");
    await post.save();
    res.status(200).json({ message: "update status successful", post });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//get post by id
router.get("/:id", jwtAuth, async (req, res) => {
  const { id } = req.params;
  console.log("keke");
  try {
    const post = await Post.findById(id).populate("owner", "name studentId");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
});

//remove post
router.delete("/delete/:id", jwtAuth, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiErrors(404, "Post not found");
    }
    // console.log(req.user.payload.user._id);
    // console.log(post.owner.toString());
    if (req.user.payload.user._id === post.owner.toString()) {
      await Comment.deleteMany({ postId });
      await Post.findByIdAndDelete(postId);
      res.status(200).json("The post has been deleted.");
    } else {
      throw new ApiErrors(404, "You can delete only your post!");
    }
  } catch (error) {
    next(error);
  }
});

//get comments post
router.get("/comment/:postId", jwtAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const postComments = await Comment.find({ postId })
      .populate("userId", "name studentId")
      .sort({ _id: -1 }); //sắp xếp theo thứ tự comment
    res.status(200).json({
      success: true,
      data: postComments,
    });
  } catch (e) {
    console.log(e);
    res.status(404).json(e.message);
  }
});

//comment post
router.post("/comment/:id", jwtAuth, async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params;
    if (comment === null) {
      res.status(404).send({ message: "comment is required" });
    }
    const newComment = new Comment({
      comment,
      userId: req.user.payload.user._id,
      postId: id,
      name: req.user.payload.user.name,
    });
    await newComment.save();

    //update comment in post
    const post = await Post.findById(id);
    post.comments.push(newComment._id);
    const updatedPost = await Post.findByIdAndUpdate(id, post, {
      new: true,
    });
    //notify post owner

    if (post.owner.toString() !== req.user.payload.user._id.toString()) {
      const notify = new Notify({
        user: post.owner,
        recipients: [req.user.payload.user._id],
        url: `/user/post/${id}`,
        text: `${req.user.payload.user.name} commented on your post.`,
        content: comment,
        isRead: false,
      });
      console.log(post.owner);
      await notify.save();
    }
    res.status(200).json(newComment);
  } catch (e) {
    console.log("failed comment", e);
    res.status(404).json({ message: "comment failed" });
  }
});
//get comment by id
router.get("/getcomment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Cannot find comment" });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error" });
  }
});

//remove comment
router.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findById(id).populate("postId");

    if (!comment) {
      return res.status(404).json({ message: "Cannot see comment" });
    }

    await Comment.findByIdAndRemove(id);

    await Post.findByIdAndUpdate(comment.postId._id, {
      $pull: { comments: comment._id },
    });

    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;

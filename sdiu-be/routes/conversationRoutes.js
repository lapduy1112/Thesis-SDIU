const router = require("express").Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { jwtAuth } = require("../middlewares/auth");
//new conv (create chat)

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/checkid", jwtAuth, async (req, res) => {
  const { studentIdSubstring } = req.body;

  try {
    const users = await User.find({
      studentId: studentIdSubstring,
    });
    console.log(users);
    const user = users[0]._id;
    const userString = user.toString();
    const existingConversation = await Conversation.findOne({
      members: {
        $all: [req.user.payload.user._id, userString],
      },
    });

    if (existingConversation) {
      return res.status(200).json({ message: "Conversation already exists.", conversation: existingConversation });
    }

    if (users) {
      const newConversation = new Conversation({
        members: [req.user.payload.user._id, userString],
      });
      console.log(req.user.payload);
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user(userchat)

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get("/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Lấy danh sách cuộc trò chuyện
//     const conversations = await Conversation.find({
//       members: { $in: [userId] },
//     });

//     // Nếu không có cuộc trò chuyện, trả về thông báo không có cuộc trò chuyện
//     if (!conversations || conversations.length === 0) {
//       return res.status(404).json({ message: 'No conversations found for the user' });
//     }

//     // Lặp qua danh sách cuộc trò chuyện và thêm thông tin người dùng liên quan
//     const conversationsWithUsers = await Promise.all(conversations.map(async (conversation) => {
//       const membersWithDetails = await Promise.all(conversation.members.map(async (memberId) => {
//         const user = await User.findById(memberId);
//         return {
//           userId: user._id,
//           email: user.email,
//           name: user.name,
//           // Thêm các thông tin người dùng khác tùy thuộc vào yêu cầu của bạn
//         };
//       }));

//       return {
//         conversationId: conversation._id,
//         members: membersWithDetails,
//         // Thêm các thông tin cuộc trò chuyện khác tùy thuộc vào yêu cầu của bạn
//       };
//     }));

//     res.status(200).json(conversationsWithUsers);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// get conv includes two userId (findchat)

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

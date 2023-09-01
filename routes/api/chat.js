const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authorization middleware
const auth = require('../../middleware/auth');

// chat model
const Chat = require('../../models/Chat');

// Create chat
router.post('/', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  const { clientId, msg } = req.body;

  if (!clientId || !msg) {
    return res.status(400).json({ msg: 'Enter all fields' });
  }
  let chatModel = { msg };
  if (user.type === 'Contractor') {
    chatModel.contractor = user.id;
    chatModel.customer = clientId;
  } else {
    chatModel.customer = user.id;
    chatModel.contractor = clientId;
  }
  const chat = new Chat(chatModel);
  chat
    .save()
    .then((chat) => res.json({ chat }))
    .catch((err) => res.status(500).json({ msg: err }));
});

// Update chat

// Update chat
router.put('/:id', auth('Contractor'), (req, res) => {
  const id = req.params.id;
  const { clientId, msg } = req.body;
  const errors = [];
  Chat.findById(id)
    .then((chat) => {
      chat.contractor = contractor;
      chat.customer = customer;
      chat.msg = msg;
      if (errors.length != 0) return res.status(400).json({ errors });
      else {
        chat
          .save()
          .then((newChat) => res.json({ data: newChat }))
          .catch((err) => res.status(500).json({ msg: 'Internal error' }));
      }
    })
    .catch((err) => {
      return res.status(404).json({ msg: 'Not found' });
    });
});

// Get all chats
router.get('/', (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  if (user.type === 'Contractor') {
    Chat.find({ contractor: user.id })
      .populate({
        path: 'customer contractor',
      })
      .then((chats) => res.json({ data: chats }))
      .catch((err) => res.sendStatus(400));
  } else {
    Chat.find({ customer: user.id })
      .populate({
        path: 'customer contractor',
      })
      .then((chats) => res.json({ data: chats }))
      .catch((err) => res.sendStatus(400));
  }
});

// Delete chat
router.delete('/:id', async function (req, res) {
  try {
    const id = req.params.id;
    let chat = await Chat.findByIdAndUpdate(id, { deleted: true });

    res.json({ chat });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Internal error' });
  }
});

module.exports = router;

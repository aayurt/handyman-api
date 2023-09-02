const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Authorization middleware
const auth = require('../../middleware/auth');

// chat model
const Chat = require('../../models/Chat');
const Contractor = require('../../models/Contractor');
const Customer = require('../../models/Customer');

// Create chat
router.post('/', async (req, res) => {
  const token = req.headers.authorization.split('Bearer ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  const decoded = jwt.verify(token, jwtSecret);
  const user = decoded;

  const { clientId, msg } = req.body;

  if (!clientId || !msg) {
    return res.status(400).json({ msg: 'Enter all fields' });
  }
  let chatModel = { msg, senderId: user.id };
  let fcm_token = '';
  if (user.type === 'Contractor') {
    chatModel.contractor = user.id;
    chatModel.customer = clientId;
    await Customer.findById(clientId).then((user) => {
      fcm_token = user.fcmToken;
    });
  } else {
    chatModel.customer = user.id;
    chatModel.contractor = clientId;
    await Contractor.findById(clientId).then((user) => {
      fcm_token = user.fcmToken;
    });
  }

  const chat = new Chat(chatModel);
  chat
    .save()
    .then((chat) => {
      if (fcm_token != null && fcm_token != '') {
        let data = JSON.stringify({
          to: fcm_token,
          notification: {
            body: 'Msg Received',
            OrganizationId: '2',
            content_available: true,
            priority: 'high',
            subtitle: 'Handyman',
            title: 'Msg Received',
          },
          data: {
            priority: 'high',
            sound: 'app_sound.wav',
            content_available: true,
            bodyText: 'You have a got a new msg.',
            organization: 'Handyman',
          },
        });

        let config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization: `key=${process.env.FCM_SERVER}`,
            'Content-Type': 'application/json',
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
      }
      res.json({ chat });
    })
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

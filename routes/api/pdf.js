const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Applicant = require('../../models/Applicant');
const pdfTemplate = require('../../documents');
const pdf = require('html-pdf');
const crypto = require('crypto');

router.get('/create-pdf/:id', (req, res) => {
  const id = req.params.id;

  const options = {
    height: '42cm',
    width: '35.7cm',
    timeout: '6000',
  };
  Applicant.findById(id)
    .then((user) => {
      pdf.create(pdfTemplate(user), options).toFile(id + '.pdf', (err) => {
        if (err) {
          console.log(err);
          res.send(Promise.reject());
        } else {
          res.send(Promise.resolve());
        }
      });
      //   user.save().then((updatedUser) => {
      //     const { password, ...userToSend } = updatedUser.toObject();
      //     res.json({ user: userToSend });
      //   });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ msg: 'Not found' });
    });
});
router.get('/fetch-pdf/:id', (req, res) => {
  const id = req.params.id;
  const file = `${id}.pdf`;
  res.download(file);
});
module.exports = router;

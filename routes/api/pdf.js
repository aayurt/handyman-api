const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Applicant = require('../../models/Applicant');
const pdfTemplate = require('../../documents');
const { default: puppeteer } = require('puppeteer');
var fs = require('fs');

router.get('/create-pdf/:id', (req, res) => {
  const id = req.params.id;

  const options = {
    height: '42cm',
    width: '35.7cm',
    timeout: '6000',
  };
  Applicant.findById(id)
    .then(async (user) => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(pdfTemplate(user));
      const pdf = await page.pdf({ format: 'A4' });
      await browser.close();

      fs.writeFile(id + '.pdf', pdf, (err) => {
        if (err) {
          console.log(err);
          res.send(Promise.reject());
        } else {
          console.log('PDF file saved to disk.');
          res.send(Promise.resolve());
        }
      });
      // pdf.create(pdfTemplate(user), options).toFile(id + '.pdf', (err) => {
      //   if (err) {
      //     console.log(err);
      //     res.send(Promise.reject());
      //   } else {
      //     res.send(Promise.resolve());
      //   }
      // });
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
  console.log(id);
  const file = `${id}.pdf`;
  res.download(file);
});
module.exports = router;

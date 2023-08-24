const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const uploadController = require('../../controllers/uploadController');

const storage = (uploadPath) => {
  return multer.diskStorage({
    destination(req, file, cb) {
      try {
        const upload_folder = `uploads/${uploadPath}`;
        if (!fs.existsSync(upload_folder)) {
          fs.mkdirSync(upload_folder, { recursive: true });
        }
      } catch (error) {
        console.error(error);
        cb(new Error('Error with storage'), `uploads/${uploadPath}`);
      }
      cb(null, `uploads/${uploadPath}`);
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}-${nameChanger(file.originalname)}`
      );
    },
  });
};
router.post(
  '/upload',
  multer({
    storage: storage('profile'),
  }).single('file'),
  uploadController.uploadImageResize
);
module.exports = router;
const nameChanger = (string) => {
  const a =
    'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b =
    'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-.]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

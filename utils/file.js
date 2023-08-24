const fs = require('fs');

const accessFile = async (source) => {
  return new Promise((resolve, reject) => {
    fs.access(source, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const unlinkFile = async (source) => {
  return new Promise((resolve, reject) => {
    fs.unlink(source, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const copyFile = async (source, destination) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, destination, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  accessFile,
  unlinkFile,
  copyFile,
};

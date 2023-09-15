const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const compression = require('compression');
var cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(compression());
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(express.json());

// DB config
const db = require('./config/keys');

// Connect to DB
mongoose
  .connect(db.mongoURI, {
    dbName: db.dbName,
  })
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/contractor', require('./routes/api/contractor'));
app.use('/api/listing', require('./routes/api/listing'));
app.use('/api/chat', require('./routes/api/chat'));
app.use('/api/category', require('./routes/api/category'));
app.use('/api/customer', require('./routes/api/customer'));
app.use('/api/application', require('./routes/api/application'));
app.use('/api/rating', require('./routes/api/rating'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/pdf', require('./routes/api/pdf'));
app.use('/api/file', require('./routes/api/image'));

const getLocalIpAddress = () => {
  const ifaces = os.networkInterfaces();
  let ipAddress = '';

  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  return ipAddress;
};

app.listen(PORT, () => {
  const ipAddress = getLocalIpAddress();
  console.log(`Server is running on ${ipAddress}:${PORT}`);

  console.log(`Server is running on port ${PORT}`);
});

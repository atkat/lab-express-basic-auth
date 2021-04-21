const bcrypt = require('bcrypt');

const password = '123456';

const hash = bcrypt.hashSync(password, salt);
const salt = bcrypt.genSaltSync();
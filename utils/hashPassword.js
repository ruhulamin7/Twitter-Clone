// dependencies
const bcrypt = require('bcrypt');

// hashing password
async function hashPassword(password) {
  const hashedString = await bcrypt.hash(password, 10);
  return hashedString;
}

// bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
//   // result == true
// });

// export
module.exports = hashPassword;

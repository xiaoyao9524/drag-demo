const portscanner = require('portscanner');
const os = require('os');
function findPort (min, max) {
  return portscanner.findAPortNotInUse(min, max)
}

function getIPAdress() {
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  findPort,
  getIPAdress
};

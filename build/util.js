const path = require('path');
const os = require('os');

function getParentPath(dirName) {
    const cwd = process.cwd(); 
    const index = cwd.indexOf(dirName) + dirName.length;
    return cwd.slice(0, index);
}

function getIPv4() {
    const ifaces = os.networkInterfaces();
    let address;
    Object.keys(ifaces).forEach(dev => {
        ifaces[dev].filter(details => {
            if (details.family === 'IPv4' && details.internal === false) {
                address = details.address;
            }
        });
    });
    return address;
}

exports.getParentPath = getParentPath;
exports.getIPv4 = getIPv4;


exports.hashData = (data) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
};

exports.signData = (data, privateKey) => {
    const crypto = require('crypto');
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'hex');
};

exports.verifySignature = (data, signature, publicKey) => {
    const crypto = require('crypto');
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'hex');
};
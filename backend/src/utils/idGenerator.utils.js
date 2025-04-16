module.exports.generateStudentId = function (studentName, birthDate) {
    const timestamp = Date.now();
    const uniqueId = `${studentName}-${birthDate}-${timestamp}`;
    return uniqueId;
};

module.exports.generateTransactionId = function (senderId, receiverId) {
    const timestamp = Date.now();
    const uniqueId = `${senderId}-${receiverId}-${timestamp}`;
    return uniqueId;
};
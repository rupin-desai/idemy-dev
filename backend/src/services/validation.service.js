class ValidationService {
    validateStudentId(studentId) {
        const studentIdPattern = /^[A-Z]{2}\d{4}$/; // Example pattern: 2 uppercase letters followed by 4 digits
        return studentIdPattern.test(studentId);
    }

    validateTransactionDetails(transaction) {
        const { sender, receiver, amount } = transaction;
        if (!sender || !receiver || amount <= 0) {
            return false;
        }
        return true;
    }

    validateBlockData(blockData) {
        const { index, previousHash, timestamp, data } = blockData;
        if (typeof index !== 'number' || typeof previousHash !== 'string' || typeof timestamp !== 'number' || !data) {
            return false;
        }
        return true;
    }
}

module.exports = ValidationService;
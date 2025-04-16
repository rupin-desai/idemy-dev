exports.TransactionController = class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }

    async createTransaction(req, res) {
        try {
            const transactionData = req.body;
            const transaction = await this.transactionService.createTransaction(transactionData);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTransaction(req, res) {
        try {
            const transactionId = req.params.id;
            const transaction = await this.transactionService.getTransaction(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.status(200).json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllTransactions(req, res) {
        try {
            const transactions = await this.transactionService.getAllTransactions();
            res.status(200).json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
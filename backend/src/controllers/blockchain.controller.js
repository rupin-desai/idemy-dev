class BlockchainController {
    constructor(blockchainService) {
        this.blockchainService = blockchainService;
    }

    async createBlockchain(req, res) {
        try {
            const blockchain = await this.blockchainService.createBlockchain();
            res.status(201).json(blockchain);
        } catch (error) {
            res.status(500).json({ message: 'Error creating blockchain', error: error.message });
        }
    }

    async getBlockchain(req, res) {
        try {
            const blockchain = await this.blockchainService.getBlockchain();
            res.status(200).json(blockchain);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving blockchain', error: error.message });
        }
    }

    async addBlock(req, res) {
        try {
            const blockData = req.body;
            const block = await this.blockchainService.addBlock(blockData);
            res.status(201).json(block);
        } catch (error) {
            res.status(500).json({ message: 'Error adding block', error: error.message });
        }
    }

    async validateBlockchain(req, res) {
        try {
            const isValid = await this.blockchainService.validateBlockchain();
            res.status(200).json({ valid: isValid });
        } catch (error) {
            res.status(500).json({ message: 'Error validating blockchain', error: error.message });
        }
    }
}

export default BlockchainController;
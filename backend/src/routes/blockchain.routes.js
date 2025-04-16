exports = function(app, blockchainController) {
    app.post('/api/blockchain', blockchainController.createBlockchain);
    app.get('/api/blockchain', blockchainController.getBlockchain);
    app.post('/api/blockchain/addBlock', blockchainController.addBlock);
    app.get('/api/blockchain/validate', blockchainController.validateBlockchain);
};
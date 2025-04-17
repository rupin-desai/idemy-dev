# Get the blockchain

curl http://localhost:3000/api/blockchain

# Create a transaction

Invoke-WebRequest -Uri "http://localhost:3000/api/transactions" -Method POST -Body '{"fromAddress":"address1", "toAddress":"address2", "amount":10, "metadata":{"studentId":"STU12345"}}' -ContentType "application/json"

# Create an ID Card

Invoke-RestMethod -Uri "http://localhost:3000/api/nft/idcards/STU7F4E1DA1" -Method Post -ContentType "application/json" -Body '{"cardType": "STUDENT", "issueDate": "2023-04-16T00:00:00.000Z", "expiryDate": "2027-04-15T00:00:00.000Z"}'

# Mint an NFT

Invoke-RestMethod -Uri "http://localhost:3000/api/nft/mint/STU7F4E1DA1" -Method Post

# Mine the transactions

Invoke-RestMethod -Uri "http://localhost:3000/api/blockchain/mine-students" -Method Post

Use a hardcoded admin@idemy.com / admin123 login

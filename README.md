# Get the blockchain

curl http://localhost:3000/api/blockchain

# Create a transaction

Invoke-WebRequest -Uri "http://localhost:3000/api/transactions" -Method POST -Body '{"fromAddress":"address1", "toAddress":"address2", "amount":10, "metadata":{"studentId":"STU12345"}}' -ContentType "application/json"

# IDEMY API Endpoints

## Authentication API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT token | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| GET | `/api/auth/verify-token` | Verify JWT token validity | Yes |
| GET | `/api/auth/users` | Get all users (admin only) | Yes (Admin) |

## Blockchain API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/blockchain` | Get the entire blockchain | No |
| GET | `/api/blockchain/info` | Get blockchain stats (length, difficulty) | No |
| GET | `/api/blockchain/validate` | Validate blockchain integrity | No |
| POST | `/api/blockchain/mine` | Mine pending transactions | Yes |
| POST | `/api/blockchain/mine-students` | Mine student transactions | Yes |
| POST | `/api/blockchain/save` | Manually save blockchain to file | Yes |
| GET | `/api/blockchain/block/index/:index` | Get block by index | No |
| GET | `/api/blockchain/block/hash/:hash` | Get block by hash | No |
| GET | `/api/blockchain/transactions/user` | Get user transactions (query: email, studentId) | Yes |
| GET | `/api/blockchain/student-by-email/:email` | Find student by email address | Yes |

## Transaction API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/transactions` | Create a new transaction | No |
| POST | `/api/transactions/add` | Add signed transaction to pending transactions | No |
| GET | `/api/transactions/pending` | Get all pending transactions | No |
| GET | `/api/transactions/student/:studentId` | Get transactions by student ID | Yes |
| GET | `/api/transactions/balance/:address` | Get balance for an address | No |
| GET | `/api/transactions/:id` | Get transaction by ID | No |

## Student API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/students/register` | Register as a student | No |
| GET | `/api/students` | Get all students | Yes |
| GET | `/api/students/:studentId` | Get student by ID | Yes |
| POST | `/api/students` | Create a new student | Yes |
| PUT | `/api/students/:studentId` | Update student information | Yes |
| DELETE | `/api/students/:studentId` | Delete a student | Yes |
| GET | `/api/students/:studentId/history` | Get student change history | Yes |
| GET | `/api/students/:id/profile` | Get student profile | Yes |

## NFT API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/nft` | Get all NFTs | No |
| GET | `/api/nft/user` | Get current user NFTs | Yes |
| POST | `/api/nft/idcards/:studentId` | Create ID card for student | Yes |
| GET | `/api/nft/idcards/:studentId` | Get ID card for student | No |
| GET | `/api/nft/idcards/:studentId/image` | Get ID card image | No |
| GET | `/api/nft/idcards/:studentId/metadata` | Get NFT metadata | No |
| POST | `/api/nft/mint/:studentId` | Mint NFT for student ID card | Yes |
| POST | `/api/nft/transfer/:tokenId` | Transfer NFT ownership | Yes |
| PUT | `/api/nft/update/:tokenId` | Update NFT version | Yes |
| GET | `/api/nft/student/:studentId/versions` | Get all NFT versions for a student | No |
| GET | `/api/nft/student/:studentId/latest` | Get latest NFT version for student | No |
| GET | `/api/nft/student/:studentId` | Get NFTs by student ID | No |
| GET | `/api/nft/:tokenId` | Get NFT by token ID | No |
| GET | `/api/nft/verify/:tokenId` | Verify NFT authenticity | No |
| GET | `/api/nft/institution/:institutionId/metadata` | Get institution NFT metadata | No |
| GET | `/api/nft/institution/:institutionId/image` | Get institution NFT image | No |

## Institution API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/institutions` | Get all institutions | No |
| GET | `/api/institutions/active` | Get active institutions | No |
| GET | `/api/institutions/me` | Get institution by user email | Yes |
| GET | `/api/institutions/:institutionId` | Get institution by ID | Yes |
| POST | `/api/institutions` | Create a new institution | Yes |
| PUT | `/api/institutions/:institutionId` | Update institution | Yes |
| DELETE | `/api/institutions/:institutionId` | Delete institution | Yes |
| POST | `/api/institutions/:institutionId/mint-nft` | Mint NFT for institution | Yes |
| GET | `/api/institutions/:institutionId/applications` | Get institution applications | No |

## Application API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/applications` | Get all applications | Yes |
| GET | `/api/applications/:applicationId` | Get application by ID | Yes |
| GET | `/api/applications/student/:studentId` | Get applications by student | Yes |
| GET | `/api/applications/institution/:institutionId` | Get applications by institution | Yes |
| POST | `/api/applications` | Create new application | Yes |
| PUT | `/api/applications/:applicationId/status` | Update application status | Yes |
| POST | `/api/applications/:applicationId/verify` | Verify application | Yes |
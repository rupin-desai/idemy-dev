# Idemy Admin Panel

## Overview

The Idemy Admin Panel is a comprehensive administration interface for managing the Idemy blockchain-based student identification system. This panel provides administrators with tools to monitor blockchain transactions, manage student records, issue digital ID cards as NFTs, and verify credential authenticity.

## Features

- **Blockchain Explorer**: View and validate blockchain integrity
- **Transaction Management**: Create, review, and monitor blockchain transactions
- **Student Management**: Register and manage student records
- **NFT Management**: Mint and transfer digital ID cards as NFTs
- **Block Mining**: Tools for manually mining new blocks
- **Authentication**: Secure login system for administrative users

## Technology Stack

- **React 19** with Vite for fast development
- **Framer Motion** for fluid animations and transitions
- **Tailwind CSS** for responsive styling
- **Lucide React** for modern iconography
- **React Router DOM** for client-side routing
- **Axios** for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Backend service running on port 3000

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-organization/idemy-dev.git
    cd idemy-dev/admin
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn
    ```

3. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. Build for production:
    ```bash
    npm run build
    # or
    yarn build
    ```

## Project Structure

```
admin/
├── src/
│   ├── api/            # API service modules
│   ├── components/     # Reusable UI components
│   │   ├── Layout/     # Layout components (Header, Sidebar)
│   │   └── ...         # Other components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── public/             # Public assets
├── package.json        # Project dependencies
└── vite.config.js      # Vite configuration
```

## Key Components

### Blockchain Explorer
View the entire blockchain, inspect individual blocks, and validate the integrity of the chain.

### Transaction Management
Create new transactions, view transaction history, and analyze transaction metadata.

### Student Records
Manage student registration information, credentials, and blockchain records.

### NFT Management
Issue digital ID cards as NFTs, transfer ownership, and track NFT history.

## Authentication Flow

1. Admin users log in via the authentication system
2. JWT tokens are used for secure session management
3. Protected routes ensure only authenticated users can access admin features
4. Role-based permissions control access to sensitive operations

## Backend Integration

The admin panel communicates with the Idemy backend API for all blockchain and user management operations. The backend provides:

- REST API endpoints for all administrative functions
- JWT authentication for secure access
- Blockchain transaction processing
- NFT minting and management
- Student record storage and retrieval

## Troubleshooting

If you encounter issues:

1. Verify the backend service is running on http://localhost:3000
2. Check the browser console for error messages
3. Ensure you have the correct authentication credentials
4. Verify network connectivity to the backend API

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

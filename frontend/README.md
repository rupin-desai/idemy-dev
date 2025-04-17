# IDEMY Frontend

![IDEMY Logo](./public/logo_full_blue.png)

## Overview

The IDEMY Frontend is a modern React application that serves as the user interface for the blockchain-verified digital student ID system. It allows students to create, manage, and verify their digital identities secured by blockchain technology.

## Features

- **User Authentication**: Secure login and registration system
- **Digital ID Creation**: Create blockchain-verified student ID cards
- **NFT Management**: View and manage your digital ID cards as NFTs
- **Blockchain Explorer**: Visualize and explore your blockchain transactions
- **ID Verification**: Verify the authenticity of your digital credentials
- **Version History**: Track changes and updates to your digital IDs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **React 19** - Modern UI library with hooks and functional components
- **Vite** - Next-generation frontend tooling for faster development
- **Framer Motion** - Animation library for smooth UI transitions
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful, consistent icon set
- **React Router DOM** - Client-side routing
- **Axios** - Promise-based HTTP client
- **Firebase Authentication** - Secure user authentication

## Project Structure

```
frontend/
├── public/              # Static files
│   ├── fonts/           # Custom Poppins font files
│   ├── logo_*.png       # Logo assets
│   └── ...
├── src/
│   ├── api/             # API service modules
│   ├── components/      # Reusable UI components
│   │   ├── Layout/      # Layout components (Header, Footer)
│   │   ├── UI/          # Generic UI components
│   │   ├── home/        # Homepage-specific components
│   │   └── ...
│   ├── context/         # React context providers
│   │   ├── AuthContext.jsx
│   │   ├── NftContext.jsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── Auth/        # Authentication pages
│   │   └── ...
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Backend service running on port 3000

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-organization/idemy-dev.git
   cd idemy-dev/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   VITE_API_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-firebase-app-id
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### User Registration and Authentication

1. Create an account using your email address
2. Verify your email address if required
3. Log in to access your digital ID features

### Creating a Digital ID

1. Navigate to the "Create ID" page
2. Fill in your student information
3. Upload a profile photo
4. Submit to create your blockchain-verified ID card

### Managing Digital IDs

- View all your digital IDs on the home page
- Click on any ID to see detailed information
- Update your ID information when needed
- Verify your ID's blockchain authenticity

### Exploring the Blockchain

- Navigate to the Blockchain page to see your transactions
- Explore how your digital identity is secured on the blockchain
- View transaction details, timestamps, and verification status

## Key Components

### Authentication System

The authentication system uses Firebase for secure user management, with custom hooks and context providers to simplify access to authentication state throughout the application.

### NFT Management

Digital IDs are represented as NFTs (Non-Fungible Tokens) on the blockchain, providing a secure and verifiable record of student identities.

### Blockchain Integration

The frontend communicates with the blockchain backend to create, verify, and manage digital credentials with full transparency and security.

## Integration with Backend

The frontend integrates with the IDEMY backend API for all blockchain and user management operations:

- REST API endpoints for all user functions
- JWT authentication for secure access
- Blockchain transaction processing
- NFT minting and management
- Student record storage and retrieval

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

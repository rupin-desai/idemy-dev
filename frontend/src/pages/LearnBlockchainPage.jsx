import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Shield,
  Lock,
  Layers,
  ChevronRight,
  Key,
  UserCheck,
  RefreshCw,
  FileCheck,
  Award,
  CheckCircle,
  AlertTriangle,
  File,
  School,
  SquarePen,
  ShieldCheck,
  Briefcase,
  Cpu,
  History,
  UserCircle,
} from "lucide-react";

const LearnBlockchainPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const questions = [
    {
      question: "What is blockchain technology?",
      answer:
        "Blockchain is a distributed, decentralized ledger that records transactions across many computers. This ensures that the record cannot be altered retroactively without the alteration of all subsequent blocks and the consensus of the network majority.",
    },
    {
      question: "How does blockchain secure my digital ID?",
      answer:
        "Your digital ID is secured on the blockchain through cryptographic hashing, ensuring that once created, the record cannot be tampered with. Each transaction related to your ID is verified by multiple computers in the network before being added, creating a tamper-evident record.",
    },
    {
      question: "What makes blockchain better than traditional databases?",
      answer:
        "Unlike traditional databases controlled by a single entity, blockchain is decentralized, making it resistant to attacks and fraud. It provides transparency, as all participants can view the entire chain, and immutability, as records cannot be altered once added to the blockchain.",
    },
    {
      question: "Can anyone see my personal information on the blockchain?",
      answer:
        "No. IDEMY uses a privacy-focused approach where your sensitive personal information is stored securely off-chain. Only cryptographic proofs and references are stored on the blockchain, allowing verification without exposing your private data.",
    },
    {
      question: "How can I verify the authenticity of a digital credential?",
      answer:
        "You can verify digital credentials by checking their blockchain record. Each credential has a unique identifier that can be validated against the blockchain to confirm its authenticity, issuing date, and current status.",
    },
    {
      question: "What is an NFT and how does it relate to my digital ID?",
      answer:
        "NFT stands for Non-Fungible Token, which is a unique digital asset recorded on the blockchain. Your digital ID is minted as an NFT, giving it unique properties that make it verifiable, transferable, and impossible to counterfeit while maintaining a complete history of updates.",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-5 text-indigo-600 flex items-center"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <h1 className="text-3xl font-bold flex items-center">
              <Database size={28} className="mr-3" />
              Blockchain Technology Explained
            </h1>
            <p className="text-xl opacity-90 mt-3">
              Understanding the power behind your secure digital identity
            </p>
          </div>

          <div className="p-6">
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="prose max-w-none"
            >
              <p className="text-lg">
                At IDEMY, we leverage blockchain technology to create secure,
                verifiable digital identities and credentials that you can
                trust. This page explains what blockchain is and why it's
                revolutionizing digital identity management.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Blockchain Basics Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Blockchain Basics</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center text-indigo-700">
                  <Database className="mr-2" size={20} />
                  What is Blockchain?
                </h3>
                <p className="mt-2">
                  Blockchain is a distributed ledger technology that records
                  transactions in a secure, transparent, and immutable way.
                  Think of it as a digital ledger that's duplicated across a
                  network of computers, making it nearly impossible to hack or
                  alter.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-medium mb-3">
                  Key Properties of Blockchain
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Shield className="h-8 w-8 text-blue-600 mb-2" />
                    <h5 className="font-medium">Decentralized</h5>
                    <p className="text-sm mt-1">
                      No single authority controls the network
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <Lock className="h-8 w-8 text-green-600 mb-2" />
                    <h5 className="font-medium">Immutable</h5>
                    <p className="text-sm mt-1">
                      Once recorded, data cannot be altered
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <Layers className="h-8 w-8 text-purple-600 mb-2" />
                    <h5 className="font-medium">Transparent</h5>
                    <p className="text-sm mt-1">
                      All transactions are visible and verifiable
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold flex items-center text-indigo-700">
                  <Key className="mr-2" size={20} />
                  How Does It Work?
                </h3>
                <p className="mt-2">
                  Blockchain operates through blocks of data that are
                  cryptographically linked together. Each block contains:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Multiple transaction records</li>
                  <li>A timestamp</li>
                  <li>A cryptographic hash of the previous block</li>
                </ul>
                <p className="mt-2">
                  This chain structure makes it virtually impossible to alter
                  past records without changing all subsequent blocks, which
                  would require consensus from the majority of the network.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blockchain for Digital Identity Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Blockchain for Digital Identity
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center text-indigo-700">
                  <UserCheck className="mr-2" size={20} />
                  Why Use Blockchain for Digital IDs?
                </h3>
                <p className="mt-2">
                  Traditional ID systems are centralized and vulnerable to data
                  breaches, fraud, and unauthorized access. Blockchain addresses
                  these issues by providing:
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      <strong>Self-sovereignty</strong> - You control your own
                      identity data
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      <strong>Privacy</strong> - You choose what to share and
                      with whom
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      <strong>Security</strong> - Cryptographic protection
                      against tampering
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      <strong>Verifiability</strong> - Easy validation without
                      contacting the issuing institution
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-medium mb-3">How IDEMY Uses Blockchain</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <FileCheck size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Credential Issuance</h5>
                      <p className="text-sm mt-1">
                        When your institution issues your digital ID, it's
                        minted as an NFT (Non-Fungible Token) on the blockchain
                        with a unique identifier
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <RefreshCw size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Updates & Versioning</h5>
                      <p className="text-sm mt-1">
                        Any updates to your ID are recorded as new versions,
                        maintaining a complete history of changes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <Shield size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Verification</h5>
                      <p className="text-sm mt-1">
                        Anyone you share your ID with can instantly verify its
                        authenticity by checking the blockchain record
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                      <Award size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h5 className="font-medium">Credential Management</h5>
                      <p className="text-sm mt-1">
                        Your blockchain wallet contains all your verified
                        credentials, making them easily accessible and shareable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NEW SECTION: IDEMY's NFT Features */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              IDEMY's Advanced NFT Features
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold flex items-center text-indigo-700">
                  <Cpu className="mr-2" size={20} />
                  NFT-Powered Digital IDs
                </h3>
                <p className="mt-2">
                  IDEMY leverages Non-Fungible Tokens (NFTs) to represent
                  digital identities and credentials. Unlike regular NFTs that
                  often represent digital art, our NFTs contain secure,
                  verifiable identity information with advanced features:
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg border border-indigo-100">
                <h4 className="font-medium mb-4 text-indigo-900">
                  Student ID NFT Minting
                </h4>
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <UserCircle size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      When a student's identity is verified by their
                      institution, a digital ID is created and "minted" as an
                      NFT on the IDEMY blockchain. This process:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>
                        Creates a unique token ID that represents the student's
                        identity
                      </li>
                      <li>
                        Securely stores identity metadata with privacy controls
                      </li>
                      <li>
                        Generates a visually appealing digital ID card with the
                        student's information
                      </li>
                      <li>
                        Records the minting transaction on the blockchain for
                        future verification
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm mb-5">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Technical Example: NFT Minting
                  </div>
                  <code className="text-xs bg-gray-50 p-2 rounded block overflow-auto">
                    {`// NFT minted for student ID: STU_38f9a2c7
tokenId: NFT_75e2d889c3b4f56a
institution: Harvard University
timestamp: 2025-04-15T14:32:18Z
signature: 0xf82a67b3c59d5e9082b...
blockchain transaction: 0x7c3a52e8...`}
                  </code>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-lg border border-green-100">
                <h4 className="font-medium mb-4 text-green-900">
                  Institution Verification NFTs
                </h4>
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <School size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      Educational institutions on IDEMY are also verified
                      through NFT technology. Each institution:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>
                        Receives a unique verification NFT that proves their
                        authenticity
                      </li>
                      <li>
                        Can digitally sign student credentials using their
                        blockchain-verified identity
                      </li>
                      <li>
                        Displays a verification badge on their profile visible
                        to all users
                      </li>
                      <li>
                        Can revoke or update credentials they've issued when
                        necessary
                      </li>
                    </ul>
                    <p className="text-sm mt-2 text-green-700 font-medium">
                      This creates a chain of trust: verified institutions can
                      issue verified student credentials.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <ShieldCheck size={16} className="text-green-500 mr-2" />
                    <span className="text-sm font-medium">
                      Institution NFT Benefits
                    </span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-700">
                    <li>
                      • Prevents impersonation of legitimate educational
                      institutions
                    </li>
                    <li>
                      • Establishes trusted relationships between institutions
                      and students
                    </li>
                    <li>
                      • Enables seamless verification of institutional authority
                    </li>
                    <li>
                      • Creates a global, decentralized registry of verified
                      educational providers
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg border border-yellow-100">
                <h4 className="font-medium mb-4 text-amber-900">
                  NFT Updates & Versioning System
                </h4>
                <div className="flex items-start mb-4">
                  <div className="bg-amber-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <History size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      IDEMY's unique NFT versioning system allows student
                      credentials to be updated while maintaining a complete
                      history:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>
                        When information changes (e.g., graduation status, new
                        qualifications), new versions are created
                      </li>
                      <li>
                        Each version is linked to previous versions, creating an
                        immutable history trail
                      </li>
                      <li>
                        Institutions can update credentials without invalidating
                        the original issuance
                      </li>
                      <li>
                        Students maintain access to all historical versions of
                        their credentials
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="bg-white p-2 rounded border border-gray-200 text-center text-xs">
                    <div className="font-medium">Version 1</div>
                    <div className="text-gray-500">Initial ID Card</div>
                    <div className="text-gray-400">Jun 2023</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-200 text-center text-xs">
                    <div className="font-medium">Version 2</div>
                    <div className="text-gray-500">Bachelor's Degree Added</div>
                    <div className="text-gray-400">May 2024</div>
                  </div>
                  <div className="bg-white p-2 rounded border border-indigo-200 text-center text-xs">
                    <div className="font-medium">Version 3</div>
                    <div className="text-gray-500">New Certification</div>
                    <div className="text-gray-400">Apr 2025</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Example of NFT version history
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg border border-blue-100">
                <h4 className="font-medium mb-4 text-blue-900">
                  Credential Verification & Authentication
                </h4>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <Briefcase size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">
                      Organizations and employers can easily verify credentials
                      through IDEMY's verification system:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li>
                        Scan a QR code or enter a credential ID to verify
                        authenticity
                      </li>
                      <li>
                        Check if a credential was issued by a verified
                        institution
                      </li>
                      <li>
                        View the complete history of updates to a credential
                      </li>
                      <li>
                        Verify the current status of a credential (active,
                        revoked, expired)
                      </li>
                    </ul>
                    <div className="mt-3 bg-white p-3 rounded border border-gray-200 flex items-center">
                      <div className="bg-gradient-to-b from-green-400 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Verified Status</div>
                        <div className="text-gray-500">
                          This credential was verified on the IDEMY blockchain
                          and is authentic
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Benefits of Blockchain-Verified IDs
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-lg mb-2">For Students</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>Portable digital identity across institutions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      Easy sharing of verified credentials with employers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>Protection against identity theft</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>Reduced paperwork for verification processes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-lg mb-2">For Institutions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      Reduced fraud through cryptographic verification
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      Lower administrative costs for credential management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>
                      Enhanced reputation through verified credentials
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle
                      size={16}
                      className="text-green-500 mt-1 mr-2 flex-shrink-0"
                    />
                    <span>Streamlined application verification processes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {questions.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <h3 className="font-medium text-lg text-indigo-700">
                    {item.question}
                  </h3>
                  <p className="mt-2">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Next Steps Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>

            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="mb-3">
                  Now that you understand how blockchain powers our secure
                  digital IDs, take the next step:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
                  >
                    Create Your Digital ID
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                  <Link
                    to="/blockchain"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-purple-700 transition-colors"
                  >
                    View Blockchain Activity
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              <div className="flex items-start bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <AlertTriangle
                  size={20}
                  className="text-yellow-600 mr-2 flex-shrink-0 mt-1"
                />
                <p className="text-sm">
                  <span className="font-medium">Note:</span> To create and use a
                  digital ID, you must be a verified student or affiliated with
                  a recognized institution in our system.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} IDEMY - Blockchain-Verified Digital
            Identity Platform
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LearnBlockchainPage;

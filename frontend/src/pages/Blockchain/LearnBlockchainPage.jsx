import React from "react";
import { motion } from "framer-motion";
import {
  LearnBlockchainHeader,
  LearnBlockchainSection,
  BlockchainBasicsSection,
  BlockchainForIdentitySection,
  NftFeaturesSection,
  BlockchainBenefitsSection,
  FaqSection,
  GetStartedSection
} from "../components/Blockchain/LearnBlockchain";

const LearnBlockchainPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <LearnBlockchainHeader sectionVariants={sectionVariants} />

        {/* Blockchain Basics Section */}
        <LearnBlockchainSection title="Blockchain Basics" variants={sectionVariants}>
          <BlockchainBasicsSection variants={sectionVariants} />
        </LearnBlockchainSection>

        {/* Blockchain for Digital Identity Section */}
        <LearnBlockchainSection title="Blockchain for Digital Identity" variants={sectionVariants}>
          <BlockchainForIdentitySection />
        </LearnBlockchainSection>

        {/* NFT Features Section */}
        <LearnBlockchainSection title="IDEMY's Advanced NFT Features" variants={sectionVariants}>
          <NftFeaturesSection />
        </LearnBlockchainSection>

        {/* Benefits Section */}
        <LearnBlockchainSection title="Benefits of Blockchain-Verified IDs" variants={sectionVariants}>
          <BlockchainBenefitsSection />
        </LearnBlockchainSection>

        {/* FAQ Section */}
        <LearnBlockchainSection title="Frequently Asked Questions" variants={sectionVariants}>
          <FaqSection />
        </LearnBlockchainSection>

        {/* Get Started Section */}
        <LearnBlockchainSection title="Ready to Get Started?" variants={sectionVariants}>
          <GetStartedSection />
        </LearnBlockchainSection>

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

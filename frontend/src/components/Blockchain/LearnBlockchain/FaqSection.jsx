import React from "react";
import FaqItem from "./ui/FaqItem";

const FaqSection = () => {
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
    <div className="space-y-4">
      {questions.map((item, index) => (
        <FaqItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FaqSection;

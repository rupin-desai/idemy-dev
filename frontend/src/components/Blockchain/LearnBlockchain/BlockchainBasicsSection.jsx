import React from "react";
import { Database, Key, Shield, Lock, Layers } from "lucide-react";
import FeatureCard from "./ui/FeatureCard";

const BlockchainBasicsSection = ({ variants }) => {
  const features = [
    {
      icon: Shield,
      title: "Decentralized",
      description: "No single authority controls the network",
      bgColorClass: "bg-blue-50",
      borderColorClass: "border border-blue-100",
    },
    {
      icon: Lock,
      title: "Immutable",
      description: "Once recorded, data cannot be altered",
      bgColorClass: "bg-green-50",
      borderColorClass: "border border-green-100",
    },
    {
      icon: Layers,
      title: "Transparent",
      description: "All transactions are visible and verifiable",
      bgColorClass: "bg-purple-50",
      borderColorClass: "border border-purple-100",
    },
  ];

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold flex items-center text-indigo-700">
          <Database className="mr-2" size={20} />
          What is Blockchain?
        </h3>
        <p className="mt-2">
          Blockchain is a distributed ledger technology that records
          transactions in a secure, transparent, and immutable way. Think of it
          as a digital ledger that's duplicated across a network of computers,
          making it nearly impossible to hack or alter.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h4 className="font-medium mb-3">Key Properties of Blockchain</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              bgColorClass={feature.bgColorClass}
              borderColorClass={feature.borderColorClass}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold flex items-center text-indigo-700">
          <Key className="mr-2" size={20} />
          How Does It Work?
        </h3>
        <p className="mt-2">
          Blockchain operates through blocks of data that are cryptographically
          linked together. Each block contains:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Multiple transaction records</li>
          <li>A timestamp</li>
          <li>A cryptographic hash of the previous block</li>
        </ul>
        <p className="mt-2">
          This chain structure makes it virtually impossible to alter past
          records without changing all subsequent blocks, which would require
          consensus from the majority of the network.
        </p>
      </div>
    </>
  );
};

export default BlockchainBasicsSection;

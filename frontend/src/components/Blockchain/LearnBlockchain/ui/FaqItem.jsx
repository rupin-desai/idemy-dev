import React from "react";

const FaqItem = ({ question, answer }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="font-medium text-lg text-indigo-700">{question}</h3>
      <p className="mt-2">{answer}</p>
    </div>
  );
};

export default FaqItem;

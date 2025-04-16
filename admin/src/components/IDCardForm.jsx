// src/components/IDCardForm.jsx
import React, { useState, useEffect } from "react";

const IDCardForm = ({ onSubmit, submitButtonText = "Create ID Card" }) => {
  const [formData, setFormData] = useState({
    cardType: "STUDENT",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    imageBase64: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageBase64: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="cardType"
            className="block text-sm font-medium text-gray-700"
          >
            Card Type *
          </label>
          <select
            id="cardType"
            name="cardType"
            value={formData.cardType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="STUDENT">Student</option>
            <option value="LIBRARY">Library</option>
            <option value="ALUMNI">Alumni</option>
            <option value="FACULTY">Faculty</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="issueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Issue Date *
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="expiryDate"
          className="block text-sm font-medium text-gray-700"
        >
          Expiry Date *
        </label>
        <input
          type="date"
          id="expiryDate"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="photo"
          className="block text-sm font-medium text-gray-700"
        >
          Photo (Optional)
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {formData.imageBase64 && (
          <div className="mt-2">
            <img 
              src={formData.imageBase64} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default IDCardForm;
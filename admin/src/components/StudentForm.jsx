import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, User, Mail, Book, Calendar, Building, FileText } from "lucide-react";
import Button from "./UI/Button";
import { iconSizes } from "../utils/animations";

const formVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fieldVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

const StudentForm = ({ student, onSubmit, submitButtonText = "Save" }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    additionalInfo: {
      program: "",
      year: "",
      department: "",
      notes: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        additionalInfo: {
          program: student.additionalInfo?.program || "",
          year: student.additionalInfo?.year || "",
          department: student.additionalInfo?.department || "",
          notes: student.additionalInfo?.notes || "",
        },
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("additionalInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      variants={formVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={fieldVariants}
      >
        <div>
          <label
            htmlFor="firstName"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User size={iconSizes.sm} className="mr-2 text-gray-500" />
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <User size={iconSizes.sm} className="mr-2 text-gray-500" />
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            required
          />
        </div>
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label
          htmlFor="email"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Mail size={iconSizes.sm} className="mr-2 text-gray-500" />
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          required
        />
      </motion.div>

      <motion.div 
        className="border-t pt-4 mt-6"
        variants={fieldVariants}
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <FileText size={iconSizes.md} className="mr-2 text-gray-700" />
          Additional Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="program"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Book size={iconSizes.sm} className="mr-2 text-gray-500" />
              Program
            </label>
            <input
              type="text"
              id="program"
              name="additionalInfo.program"
              value={formData.additionalInfo.program}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <Calendar size={iconSizes.sm} className="mr-2 text-gray-500" />
              Year
            </label>
            <input
              type="text"
              id="year"
              name="additionalInfo.year"
              value={formData.additionalInfo.year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="department"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Building size={iconSizes.sm} className="mr-2 text-gray-500" />
            Department
          </label>
          <input
            type="text"
            id="department"
            name="additionalInfo.department"
            value={formData.additionalInfo.department}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="notes"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FileText size={iconSizes.sm} className="mr-2 text-gray-500" />
            Notes
          </label>
          <textarea
            id="notes"
            name="additionalInfo.notes"
            rows="3"
            value={formData.additionalInfo.notes}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          ></textarea>
        </div>
      </motion.div>

      <motion.div 
        className="flex justify-end"
        variants={fieldVariants}
      >
        <Button
          type="submit"
          color="primary"
          loading={loading}
          icon={<Save size={iconSizes.sm} />}
        >
          {submitButtonText}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default StudentForm;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Building, Mail, Globe, Calendar, MapPin, Book } from "lucide-react";
import Button from "../UI/Button";
import { iconSizes } from "../../utils/animations";

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

const InstitutionForm = ({ institution, onSubmit, submitButtonText = "Save" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    institutionType: "University",
    foundingYear: new Date().getFullYear(),
    website: "",
    contactInfo: {
      phone: "",
      address: ""
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name || "",
        email: institution.email || "",
        location: institution.location || "",
        institutionType: institution.institutionType || "University",
        foundingYear: institution.foundingYear || new Date().getFullYear(),
        website: institution.website || "",
        contactInfo: {
          phone: institution.contactInfo?.phone || "",
          address: institution.contactInfo?.address || ""
        }
      });
    }
  }, [institution]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
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
        variants={fieldVariants}
      >
        <label
          htmlFor="name"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Building size={iconSizes.sm} className="mr-2 text-gray-500" />
          Institution Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          required
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={fieldVariants}
      >
        <div>
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
        </div>

        <div>
          <label
            htmlFor="institutionType"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Book size={iconSizes.sm} className="mr-2 text-gray-500" />
            Institution Type
          </label>
          <select
            id="institutionType"
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          >
            <option value="University">University</option>
            <option value="College">College</option>
            <option value="School">School</option>
            <option value="Institute">Institute</option>
            <option value="Academy">Academy</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={fieldVariants}
      >
        <div>
          <label
            htmlFor="location"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <MapPin size={iconSizes.sm} className="mr-2 text-gray-500" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        <div>
          <label
            htmlFor="foundingYear"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <Calendar size={iconSizes.sm} className="mr-2 text-gray-500" />
            Founding Year
          </label>
          <input
            type="number"
            id="foundingYear"
            name="foundingYear"
            value={formData.foundingYear}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label
          htmlFor="website"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Globe size={iconSizes.sm} className="mr-2 text-gray-500" />
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="https://example.com"
        />
      </motion.div>

      <motion.div 
        className="border-t pt-4 mt-6"
        variants={fieldVariants}
      >
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="contactInfo.phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="contactInfo.phone"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="contactInfo.address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="contactInfo.address"
              name="contactInfo.address"
              value={formData.contactInfo.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
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

export default InstitutionForm;
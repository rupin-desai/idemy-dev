import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  FileText,
  Pickaxe,
  Rows,
  Users,
  Shield,
  Building,
  ClipboardList
} from "lucide-react";
import { listItemVariants, iconSizes } from "../../utils/animations";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={iconSizes.md} />,
    },
    {
      path: "/blockchain",
      label: "Blockchain Explorer",
      icon: <Database size={iconSizes.md} />,
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: <FileText size={iconSizes.md} />,
    },
    {
      path: "/mine",
      label: "Mine Block",
      icon: <Pickaxe size={iconSizes.md} />,
    },
    {
      path: "/student-transactions",
      label: "Student Transactions",
      icon: <Rows size={iconSizes.md} />,
    },
    {
      path: "/students",
      label: "Student Management",
      icon: <Users size={iconSizes.md} />,
    },
    {
      path: "/institutions",
      label: "Institution Management",
      icon: <Building size={iconSizes.md} />,
    },
    {
      path: "/applications",
      label: "Applications",
      icon: <ClipboardList size={iconSizes.md} />,
    },
    {
      path: "/nfts",
      label: "NFT Management",
      icon: <Shield size={iconSizes.md} />,
    },
  ];

  const sidebarVariants = {
    initial: { x: -20, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.aside
      className="bg-gray-800 text-white w-64 min-h-screen p-4 z-20"
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex justify-center mb-8">
        <img 
          src="/logo_full_white.png" 
          alt="IDEMY" 
          className="h-10" 
        />
      </div>
      
      <nav>
        <motion.ul>
          {navItems.map((item) => (
            <motion.li
              key={item.path}
              className="mb-2"
              variants={listItemVariants}
            >
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === item.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

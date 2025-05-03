import React from "react";
import { motion } from "framer-motion";
import ApplyToInstitutionCard from "./ApplyToInstitutionCard";

const ApplyToInstitutionList = ({
  institutions,
  getApplicationStatus,
  onOpenApplicationForm,
  itemVariants,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <div className="grid gap-6">
        {institutions.map((institution) => {
          const applicationStatus = getApplicationStatus(
            institution.institutionId
          );

          return (
            <ApplyToInstitutionCard
              key={institution.institutionId}
              institution={institution}
              applicationStatus={applicationStatus}
              onOpenApplicationForm={onOpenApplicationForm}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default ApplyToInstitutionList;

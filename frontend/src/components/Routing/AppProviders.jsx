import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { NftProvider } from "../../context/NftContext";
import { InstitutionProvider } from "../../context/InstitutionContext";
import { ApplicationProvider } from "../../context/ApplicationContext";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <NftProvider>
        <InstitutionProvider>
          <ApplicationProvider>
            <Router>{children}</Router>
          </ApplicationProvider>
        </InstitutionProvider>
      </NftProvider>
    </AuthProvider>
  );
};

export default AppProviders;

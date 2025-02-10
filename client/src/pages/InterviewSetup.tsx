// src/pages/InterviewSetup.tsx
import React from "react";
import RoleSelectionForm from "../components/RoleSelectionForm";

const InterviewSetup: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Interview Setup</h1>
      <p className="mb-6">
        Please select the role that best describes your position. This helps
        tailor the interview experience.
      </p>
      <RoleSelectionForm />
    </div>
  );
};

export default InterviewSetup;

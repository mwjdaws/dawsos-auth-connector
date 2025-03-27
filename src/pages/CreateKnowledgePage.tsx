
import React from "react";
import { CreateKnowledgeForm } from "@/components/CreateKnowledgeForm";

const CreateKnowledgePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Knowledge Source</h1>
      <CreateKnowledgeForm />
    </div>
  );
};

export default CreateKnowledgePage;

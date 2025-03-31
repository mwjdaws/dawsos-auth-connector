
/**
 * MetadataContext Provider
 * 
 * This context provides metadata information to the entire Metadata Panel
 * and its child components. It includes tags, ontology terms, and external
 * source information.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Tag } from "@/types/tag";
import { OntologyTerm } from "../types";
import { isValidContentId } from "@/utils/content-validation";

// Define the context value shape
interface MetadataContextValue {
  contentId: string;
  isValidContent: boolean;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  ontologyTerms: OntologyTerm[];
  setOntologyTerms: React.Dispatch<React.SetStateAction<OntologyTerm[]>>;
  externalSourceUrl: string | null;
  setExternalSourceUrl: React.Dispatch<React.SetStateAction<string | null>>;
  needsExternalReview: boolean;
  setNeedsExternalReview: React.Dispatch<React.SetStateAction<boolean>>;
  lastCheckedAt: string | null;
  setLastCheckedAt: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the actual context
const MetadataContext = createContext<MetadataContextValue | undefined>(undefined);

// Provider component
export const MetadataProvider: React.FC<{
  contentId: string;
  children: React.ReactNode;
}> = ({ contentId, children }) => {
  const [isValidContent] = useState(() => isValidContentId(contentId));
  const [tags, setTags] = useState<Tag[]>([]);
  const [ontologyTerms, setOntologyTerms] = useState<OntologyTerm[]>([]);
  const [externalSourceUrl, setExternalSourceUrl] = useState<string | null>(null);
  const [needsExternalReview, setNeedsExternalReview] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  // Reset the state when the contentId changes
  useEffect(() => {
    setTags([]);
    setOntologyTerms([]);
    setExternalSourceUrl(null);
    setNeedsExternalReview(false);
    setLastCheckedAt(null);
  }, [contentId]);

  return (
    <MetadataContext.Provider
      value={{
        contentId,
        isValidContent,
        tags,
        setTags,
        ontologyTerms,
        setOntologyTerms,
        externalSourceUrl,
        setExternalSourceUrl,
        needsExternalReview,
        setNeedsExternalReview,
        lastCheckedAt,
        setLastCheckedAt
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

// Custom hook to use the context
export const useMetadataContext = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadataContext must be used within a MetadataProvider");
  }
  return context;
};

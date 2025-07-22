import { useState, useEffect } from "react";
import { CVWizard } from "@/components/CVWizard/CVWizard";
import { ApiKeySetup } from "@/components/CVWizard/ApiKeySetup";
import { openaiService } from "@/services/openaiService";

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    openaiService.initialize();
    setHasApiKey(openaiService.hasApiKey());
  }, []);

  const handleApiKeyComplete = () => {
    setHasApiKey(true);
  };

  if (!hasApiKey) {
    return <ApiKeySetup onComplete={handleApiKeyComplete} />;
  }

  return <CVWizard />;
};

export default Index;

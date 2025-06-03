
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { RoundSettingsFormValues } from '../RoundSettingsForm';
import { KnowledgeRoundTab } from './KnowledgeRoundTab';
import { SpeedRoundTab } from './SpeedRoundTab';
import { WheelRoundTab } from './WheelRoundTab';
import { StandardQuestionsTab } from './StandardQuestionsTab';
import { AllQuestionsTab } from './AllQuestionsTab';

interface RoundSettingsPanelProps {
  activeTab: string;
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function RoundSettingsPanel({ 
  activeTab, 
  form, 
  onSubmit,
  importFormat,
  setImportFormat
}: RoundSettingsPanelProps) {
  switch (activeTab) {
    case "all":
      return <AllQuestionsTab />;
    case "knowledge":
      return <KnowledgeRoundTab form={form} onSubmit={onSubmit} />;
    case "speed":
      return <SpeedRoundTab importFormat={importFormat} setImportFormat={setImportFormat} />;
    case "wheel":
      return <WheelRoundTab form={form} onSubmit={onSubmit} />;
    case "standard":
      return <StandardQuestionsTab />;
    default:
      return <AllQuestionsTab />;
  }
}

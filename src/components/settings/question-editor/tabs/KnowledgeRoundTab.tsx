
import React from 'react';
import { RoundSettingsForm, RoundSettingsFormValues } from '../RoundSettingsForm';
import { UseFormReturn } from "react-hook-form";

interface KnowledgeRoundTabProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function KnowledgeRoundTab({ form, onSubmit }: KnowledgeRoundTabProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 1: Wiedza</h3>
      <RoundSettingsForm form={form} onSubmit={onSubmit} />
    </div>
  );
}

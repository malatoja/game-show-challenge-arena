
import React from 'react';
import { Round3SettingsForm } from '../Round3SettingsForm';
import { RoundSettingsFormValues } from '../RoundSettingsForm';
import { UseFormReturn } from "react-hook-form";

interface WheelRoundTabProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function WheelRoundTab({ form, onSubmit }: WheelRoundTabProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 3: Koło Fortuny</h3>
      <Round3SettingsForm form={form} onSubmit={onSubmit} />
    </div>
  );
}

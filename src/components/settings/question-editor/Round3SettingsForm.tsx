
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
import { RoundSettingsFormValues } from './RoundSettingsForm';
import { UseFormReturn } from 'react-hook-form';

interface Round3SettingsFormProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function Round3SettingsForm({ form, onSubmit }: Round3SettingsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="round3Category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domyślna kategoria dla Koła Fortuny</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                  {WHEEL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/90">
          Zapisz ustawienia rundy 3
        </Button>
      </form>
    </Form>
  );
}

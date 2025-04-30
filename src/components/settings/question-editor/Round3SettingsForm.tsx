
import React from 'react';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/utils/gameUtils';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoundSettingsFormValues } from './RoundSettingsForm';
import { UseFormReturn } from "react-hook-form";

interface Round3SettingsFormProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function Round3SettingsForm({ form, onSubmit }: Round3SettingsFormProps) {
  const categories = getAllCategories();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
        <FormField
          control={form.control}
          name="round3Category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domyślna kategoria dla koła</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Kategoria tematyczna dla pytań w Rundzie 3 (Koło Fortuny)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="bg-gameshow-primary">
          Zapisz ustawienia
        </Button>
      </form>
    </Form>
  );
}

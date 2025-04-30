
import React from 'react';
import { z } from "zod";
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
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema for the form
export const roundSettingsSchema = z.object({
  round1Difficulty: z.string(),
  round1Category: z.string(),
  round3Category: z.string(),
});

// Define the type from the schema
export type RoundSettingsFormValues = z.infer<typeof roundSettingsSchema>;

interface RoundSettingsFormProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function RoundSettingsForm({ form, onSubmit }: RoundSettingsFormProps) {
  const categories = getAllCategories();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
        <FormField
          control={form.control}
          name="round1Difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trudność pytań</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz poziom trudności" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                  <SelectItem value="5">Łatwy (5 punktów)</SelectItem>
                  <SelectItem value="10">Średni (10 punktów)</SelectItem>
                  <SelectItem value="15">Trudny (15 punktów)</SelectItem>
                  <SelectItem value="20">Bardzo trudny (20 punktów)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Poziom trudności wpływa na liczbę punktów za poprawną odpowiedź
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="round1Category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
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
                  <SelectItem value="">Losowa</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Domyślna kategoria dla pytań w Rundzie 1
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


import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllCategories } from '@/utils/gameUtils';
import { toast } from 'sonner';

// Form validation schema
export const roundSettingsSchema = z.object({
  round1Difficulty: z.string(),
  round1Category: z.string().optional(),
  round3Category: z.string().optional(),
});

// Form values type
export type RoundSettingsFormValues = z.infer<typeof roundSettingsSchema>;

interface RoundSettingsFormProps {
  form: any; // Using any since it's passed from parent
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function RoundSettingsForm({ form, onSubmit }: RoundSettingsFormProps) {
  const categories = getAllCategories();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="round1Category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domyślna kategoria dla Rundy 1</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value || ""}
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                  <SelectItem value="">Dowolna kategoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="round1Difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poziom trudności dla Rundy 1 (punktacja)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz poziom trudności" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                  <SelectItem value="5">Łatwy (5 pkt)</SelectItem>
                  <SelectItem value="10">Średni (10 pkt)</SelectItem>
                  <SelectItem value="15">Trudny (15 pkt)</SelectItem>
                  <SelectItem value="20">Ekspert (20 pkt)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-neon-blue hover:bg-neon-blue/90">
          Zapisz ustawienia rundy 1
        </Button>
      </form>
    </Form>
  );
}

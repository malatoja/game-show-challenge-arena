
import React from 'react';
import { Button } from '@/components/ui/button';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
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
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// Define form schema for round settings
export const roundSettingsSchema = z.object({
  round1Difficulty: z.enum(["5", "10", "15", "20"]).default("10"),
  round1Category: z.string().min(1, {
    message: "Wybierz kategorię dla rundy 1",
  }),
  round3Category: z.string().min(1, {
    message: "Wybierz kategorię dla rundy 3",
  }),
});

export type RoundSettingsFormValues = z.infer<typeof roundSettingsSchema>;

interface RoundSettingsFormProps {
  form: UseFormReturn<RoundSettingsFormValues>;
  onSubmit: (values: RoundSettingsFormValues) => void;
}

export function RoundSettingsForm({ form, onSubmit }: RoundSettingsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="round1Difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trudność pytań (punkty)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                      <SelectValue placeholder="Wybierz trudność" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectItem value="5">Łatwe (5 pkt)</SelectItem>
                    <SelectItem value="10">Średnie (10 pkt)</SelectItem>
                    <SelectItem value="15">Trudne (15 pkt)</SelectItem>
                    <SelectItem value="20">Bardzo trudne (20 pkt)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Określa wartość punktową odpowiedzi na pytanie
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
                <FormLabel>Kategoria pytań</FormLabel>
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
                    {WHEEL_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Kategoria tematyczna dla pytań w Rundzie 1
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="bg-gameshow-primary">
          Zapisz ustawienia
        </Button>
      </form>
    </Form>
  );
}

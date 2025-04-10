import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterService } from '@/services/newsletterService';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  CheckCircle, 
  Mail, 
  Calendar, 
  Newspaper, 
  TrendingUp, 
  PieChart, 
  Sparkles 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  frequency: z.enum(['daily', 'weekly', 'monthly'], {
    required_error: "Please select a frequency",
  }),
  includeSectorAnalysis: z.boolean().default(true),
  includeTopStocks: z.boolean().default(true),
  includeNewsDigest: z.boolean().default(true),
  includePredictions: z.boolean().default(false),
});

// Form values type
type FormValues = z.infer<typeof formSchema>;

interface NewsletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterDialog: React.FC<NewsletterDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();

  // Initialize react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      frequency: "weekly",
      includeSectorAnalysis: true,
      includeTopStocks: true,
      includeNewsDigest: true,
      includePredictions: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Send preferences to the newsletter service
      await newsletterService.subscribe({
        email: values.email,
        frequency: values.frequency,
        includeSectorAnalysis: values.includeSectorAnalysis,
        includeTopStocks: values.includeTopStocks,
        includeNewsDigest: values.includeNewsDigest,
        includePredictions: values.includePredictions
      });
      setIsSuccess(true);
      
      // Reset form after 5 seconds and close dialog
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        onOpenChange(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-primary" />
            Subscribe to our Newsletter
          </DialogTitle>
          <DialogDescription>
            Stay updated with the latest financial insights and market trends tailored to your interests.
          </DialogDescription>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium text-center">Successfully Subscribed!</h3>
            <p className="text-center text-muted-foreground">
              Thank you for subscribing. We've sent you a welcome newsletter to {form.getValues().email}.
              You'll receive updates according to your selected frequency.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@example.com" 
                        {...field} 
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Delivery Frequency
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">
                          Daily (Morning Briefing)
                        </SelectItem>
                        <SelectItem value="weekly">
                          Weekly (Weekend Recap)
                        </SelectItem>
                        <SelectItem value="monthly">
                          Monthly (Market Overview)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often would you like to receive market updates?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium">Newsletter Content</h3>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="includeTopStocks"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Top Performing Stocks
                          </FormLabel>
                          <FormDescription>
                            Receive updates on the best performing stocks
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeSectorAnalysis"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-1.5">
                            <PieChart className="h-4 w-4 text-primary" />
                            Sector Analysis
                          </FormLabel>
                          <FormDescription>
                            Get insights on different market sectors
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeNewsDigest"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-1.5">
                            <Newspaper className="h-4 w-4 text-primary" />
                            News Digest
                          </FormLabel>
                          <FormDescription>
                            Important financial news and headlines
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includePredictions"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Market Predictions
                          </FormLabel>
                          <FormDescription>
                            AI-powered forecasts and market predictions
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={cn(
                    "w-full", 
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterDialog; 
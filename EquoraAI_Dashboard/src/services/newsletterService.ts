import { toast } from "sonner";
import { apiClient } from './apiClient';

export interface NewsletterPreferences {
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  includeSectorAnalysis?: boolean;
  includeTopStocks?: boolean;
  includeNewsDigest?: boolean;
  includePredictions?: boolean;
}

export interface NewsletterSubscription {
  id: string;
  createdAt: string;
  preferences: NewsletterPreferences;
  isActive: boolean;
}

class NewsletterService {
  private subscriptions: NewsletterSubscription[] = [];
  
  constructor() {
    // In a real app, we would load subscriptions from localStorage or an API
    this.loadSubscriptions();
  }
  
  private loadSubscriptions() {
    try {
      const saved = localStorage.getItem('newsletter_subscriptions');
      if (saved) {
        this.subscriptions = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load newsletter subscriptions:", error);
    }
  }
  
  private saveSubscriptions() {
    try {
      localStorage.setItem('newsletter_subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error("Failed to save newsletter subscriptions:", error);
    }
  }
  
  /**
   * Subscribe a user to the newsletter
   * @param preferences User's newsletter preferences
   * @returns Promise resolving to success message or error
   */
  async subscribe(preferences: NewsletterPreferences): Promise<{ success: boolean; message: string }> {
    try {
      // In a real application, this would be an API call
      // For demo purposes, we're simulating a successful API call
      
      // Uncomment this when API is ready:
      // const response = await apiClient.post('/api/newsletter/subscribe', preferences);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Newsletter subscription:', preferences);
      
      return {
        success: true,
        message: 'Successfully subscribed to newsletter'
      };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw new Error('Failed to subscribe to newsletter');
    }
  }
  
  /**
   * Unsubscribe a user from the newsletter
   * @param email User's email address
   * @returns Promise resolving to success message or error
   */
  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real application, this would be an API call
      // For demo purposes, we're simulating a successful API call
      
      // Uncomment this when API is ready:
      // const response = await apiClient.post('/api/newsletter/unsubscribe', { email });
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Newsletter unsubscription:', email);
      
      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      };
    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      throw new Error('Failed to unsubscribe from newsletter');
    }
  }
  
  async getSubscription(email: string): Promise<NewsletterSubscription | null> {
    // In a real app, this would be an API call
    const subscription = this.subscriptions.find(
      sub => sub.preferences.email === email && sub.isActive
    );
    
    return subscription || null;
  }
}

// Create and export a singleton instance
export const newsletterService = new NewsletterService();

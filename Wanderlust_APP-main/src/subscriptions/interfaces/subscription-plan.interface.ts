/**
 * Interface representing a subscription plan with its features and pricing
 */
export interface SubscriptionPlan {
  /** Unique identifier for the subscription plan */
  id: string;
  
  /** Name of the subscription plan */
  name: string;
  
  /** Price in USD for the subscription plan */
  price: number;
  
  /** Duration of the subscription in days */
  duration: number;
  
  /** List of features included in this subscription plan */
  features: string[];
  
  /** Description of the subscription plan */
  description: string;
  
  /** Whether this is a popular/recommended plan */
  isPopular: boolean;
}

/**
 * Enum for subscription plan types
 */
export enum SubscriptionPlanType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

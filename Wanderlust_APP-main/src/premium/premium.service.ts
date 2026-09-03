import { Injectable, Logger } from '@nestjs/common';
import { PackingTipsDto, PackingTipsResponseDto, SimulatePlanDto, SimulatePlanResponseDto, DayItinerary, Activity } from './dto';

/**
 * Service for providing premium features like packing tips and trip simulation
 */
@Injectable()
export class PremiumService {
  private readonly logger = new Logger(PremiumService.name);

  /**
   * Generate packing tips based on country and travel dates
   * @param packingTipsDto The packing tips request
   * @returns Packing recommendations and advice
   */
  async getPackingTips(packingTipsDto: PackingTipsDto): Promise<PackingTipsResponseDto> {
    this.logger.log(`Generating packing tips for country: ${packingTipsDto.country}, dates: ${packingTipsDto.startDate} to ${packingTipsDto.endDate}`);
    
    const { country, startDate } = packingTipsDto;
    
    // Extract month from startDate
    const month = this.extractMonthFromDate(startDate);
    
    const items: string[] = [];
    let advice: string = '';

    // Mock logic for France and July
    if (country.toLowerCase().includes('france') && month.toLowerCase() === 'july') {
      items.push('Sunscreen (SPF 30+)', 'Light cotton clothes', 'Sunglasses', 'Hat', 'Comfortable walking shoes', 'Swimsuit');
      advice = 'July is peak summer in France with hot temperatures. Pack light, breathable clothing and sun protection.';
    }
    // Mock logic for rainy months (general)
    else if (this.isRainyMonth(month)) {
      items.push('Umbrella', 'Rain jacket', 'Waterproof shoes', 'Quick-dry clothes', 'Small towel');
      advice = `${month} typically has rainy weather. Ensure you have proper rain protection and waterproof clothing.`;
    }
    // Default logic for other destinations/months
    else {
      items.push('Comfortable walking shoes', 'Weather-appropriate clothing', 'Basic toiletries', 'Camera', 'Travel adapter');
      advice = `General packing recommendations for ${country} in ${month}. Check specific weather conditions closer to your travel date.`;
    }

    this.logger.log(`Generated ${items.length} packing items for ${country} in ${month}`);

    return {
      items,
      advice,
    };
  }

  /**
   * Extract month name from date string (YYYY-MM-DD format)
   * @param dateString The date string
   * @returns Month name
   */
  private extractMonthFromDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      return monthNames[date.getMonth()];
    } catch (error) {
      this.logger.error(`Invalid date format: ${dateString}`);
      return 'unknown';
    }
  }

  /**
   * Simulate a travel plan based on user preferences
   * @param simulatePlanDto The simulate plan request
   * @returns Structured 3-day itinerary
   */
  async simulatePlan(simulatePlanDto: SimulatePlanDto): Promise<SimulatePlanResponseDto> {
    this.logger.log(`Generating ${simulatePlanDto.style} trip for ${simulatePlanDto.destination}`);
    
    const { destination, budget, style, interests } = simulatePlanDto;
    
    // Handle budget: use default $100/day if not numeric, otherwise use provided value
    const dailyBudget = isNaN(parseFloat(budget)) ? 100 : parseFloat(budget);
    
    // Generate mock 3-day itinerary
    const itinerary: DayItinerary[] = [];
    let totalEstimatedCost = 0;

    for (let day = 1; day <= 3; day++) {
      const dayItinerary = this.generateDayItinerary(day, destination, style, interests, dailyBudget);
      itinerary.push(dayItinerary);
      totalEstimatedCost += this.calculateDayCost(dayItinerary);
    }

    this.logger.log(`Generated 3-day itinerary for ${destination} with total estimated cost: $${totalEstimatedCost}`);

    return {
      destination,
      itinerary,
      totalEstimatedCost,
    };
  }

  /**
   * Calculate total cost for a day itinerary
   * @param dayItinerary The day itinerary
   * @returns Total cost for the day
   */
  private calculateDayCost(dayItinerary: DayItinerary): number {
    return dayItinerary.activities.reduce((total, activity) => total + activity.cost, 0);
  }

  /**
   * Check if a month is typically rainy
   * @param month The month to check
   * @returns boolean indicating if the month is rainy
   */
  private isRainyMonth(month: string): boolean {
    const rainyMonths = ['january', 'february', 'march', 'april', 'october', 'november', 'december'];
    return rainyMonths.includes(month.toLowerCase());
  }

  /**
   * Generate a single day itinerary
   * @param dayNumber The day number
   * @param destination The travel destination
   * @param style Travel style preference
   * @param interests User interests
   * @param dailyBudget Budget for this day
   * @returns Day itinerary with activities
   */
  private generateDayItinerary(
    dayNumber: number, 
    destination: string, 
    style: string, 
    interests: string[], 
    dailyBudget: number
  ): DayItinerary {
    const activities: Activity[] = [];

    // For relax style, reduce activities and start later
    if (style === 'relax') {
      // Only 2 activities for relaxed pace
      const morningActivity = this.generateActivity('morning', destination, interests, style, dailyBudget * 0.5, dayNumber);
      activities.push(morningActivity);
      
      const afternoonActivity = this.generateActivity('afternoon', destination, interests, style, dailyBudget * 0.5, dayNumber);
      activities.push(afternoonActivity);
    } else {
      // Standard 3 activities for other styles
      const morningActivity = this.generateActivity('morning', destination, interests, style, dailyBudget * 0.3, dayNumber);
      activities.push(morningActivity);

      const afternoonActivity = this.generateActivity('afternoon', destination, interests, style, dailyBudget * 0.4, dayNumber);
      activities.push(afternoonActivity);

      const eveningActivity = this.generateActivity('evening', destination, interests, style, dailyBudget * 0.3, dayNumber);
      activities.push(eveningActivity);
    }

    return {
      dayNumber,
      activities,
    };
  }

  /**
   * Generate a single activity based on time of day and interests
   * @param timeOfDay The time of day (morning, afternoon, evening)
   * @param destination The destination
   * @param interests User interests
   * @param style Travel style
   * @param budget Budget for this activity
   * @returns Activity details
   */
  private generateActivity(
    timeOfDay: string, 
    destination: string, 
    interests: string[], 
    style: string, 
    budget: number,
    dayNumber: number
  ): Activity {
    const interest = interests[Math.floor(Math.random() * interests.length)] || 'sightseeing';
    
    // Expanded activity templates with variety to prevent repetition
    const activityTemplates: Record<string, Record<string, any[]>> = {
      culture: {
        morning: [
          { activity: 'Museum Visit', cost: 20 },
          { activity: 'Historical Site Tour', cost: 25 },
          { activity: 'Cultural Center Visit', cost: 18 }
        ],
        afternoon: [
          { activity: 'Historical Walking Tour', cost: 25 },
          { activity: 'Heritage Museum', cost: 22 },
          { activity: 'Cultural District Tour', cost: 28 }
        ],
        evening: [
          { activity: 'Cultural Performance', cost: 30 },
          { activity: 'Traditional Music Show', cost: 35 },
          { activity: 'Local Theater Experience', cost: 32 }
        ],
      },
      food: {
        morning: [
          { activity: 'Local Breakfast Experience', cost: 18 },
          { activity: 'Market Food Tour', cost: 20 },
          { activity: 'Café Culture Experience', cost: 15 }
        ],
        afternoon: [
          { activity: 'Food Tour', cost: 28 },
          { activity: 'Cooking Class', cost: 35 },
          { activity: 'Street Food Adventure', cost: 25 }
        ],
        evening: [
          { activity: 'Fine Dining Restaurant', cost: 35 },
          { activity: 'Local Food Market', cost: 30 },
          { activity: 'Fusion Cuisine Experience', cost: 40 }
        ],
      },
      art: {
        morning: [
          { activity: 'Art Gallery Visit', cost: 15 },
          { activity: 'Contemporary Art Museum', cost: 18 },
          { activity: 'Local Artist Studio', cost: 12 }
        ],
        afternoon: [
          { activity: 'Street Art Tour', cost: 22 },
          { activity: 'Art District Walking Tour', cost: 25 },
          { activity: 'Creative Workshop', cost: 30 }
        ],
        evening: [
          { activity: 'Art Workshop', cost: 25 },
          { activity: 'Gallery Opening', cost: 20 },
          { activity: 'Art Exhibition', cost: 18 }
        ],
      },
      default: {
        morning: [
          { activity: 'City Walking Tour', cost: 20 },
          { activity: 'Landmark Visit', cost: 18 },
          { activity: 'City Orientation Tour', cost: 22 }
        ],
        afternoon: [
          { activity: 'Local Shopping', cost: 25 },
          { activity: 'City Park Visit', cost: 15 },
          { activity: 'Local Market Exploration', cost: 20 }
        ],
        evening: [
          { activity: 'Sunset Viewpoint', cost: 15 },
          { activity: 'City Night Tour', cost: 20 },
          { activity: 'Local Bar Experience', cost: 18 }
        ],
      },
    };

    const template = activityTemplates[interest] || activityTemplates.default;
    const activityOptions = template[timeOfDay] || template.default;
    
    // Use dayNumber to ensure variety across days
    const activityIndex = (dayNumber + Math.floor(Math.random() * 2)) % activityOptions.length;
    const activityData = activityOptions[activityIndex];

    // Adjust cost based on style
    let adjustedCost = activityData.cost;
    if (style === 'luxury') {
      adjustedCost *= 2.5;
    } else if (style === 'budget') {
      adjustedCost *= 0.6;
    }
    // For medium style, keep costs as-is (20-50 range)

    // Ensure cost is always a valid number and within reasonable range
    const finalCost = Math.max(20, Math.min(50, adjustedCost));

    // For relax style, adjust morning time to start later
    let timeString = this.getTimeForTimeOfDay(timeOfDay);
    if (style === 'relax' && timeOfDay === 'morning') {
      timeString = '10:00'; // Start later for relaxed pace
    }

    return {
      time: timeString,
      activity: activityData.activity,
      cost: finalCost,
    };
  }

  /**
   * Get time string based on time of day
   * @param timeOfDay The time of day
   * @returns Time string
   */
  private getTimeForTimeOfDay(timeOfDay: string): string {
    const times: Record<string, string> = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '19:00',
    };
    return times[timeOfDay] || '12:00';
  }

  /**
   * Generate a trip summary
   * @param destination The destination
   * @param style Travel style
   * @param interests User interests
   * @param totalCost Total trip cost
   * @returns Trip summary string
   */
  private generateTripSummary(destination: string, style: string, interests: string[], totalCost: number): string {
    return `A ${style} 3-day trip to ${destination} focusing on ${interests.join(', ')}. 
    This itinerary offers a perfect balance of cultural experiences, local cuisine, and must-see attractions 
    tailored to your interests. Total estimated cost: $${totalCost.toFixed(2)}.`;
  }
}

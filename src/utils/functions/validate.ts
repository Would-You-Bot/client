import moment from 'moment-timezone';

/**
 * Function to validate and format the user-entered timezone.
 * @param timezone The timezone to validate and format.
 * @returns The formatted timezone or null if the timezone is invalid.
 */
export const validateAndFormatTimezone = (timezone: string): string | null => {
  // Check if the timezone is a valid timezone identifier
  if (moment.tz.zone(timezone)) {
    // Format the timezone to a standardized format
    const formattedTimezone = moment.tz(timezone).zoneAbbr();

    return formattedTimezone;
  }

  return null;
};

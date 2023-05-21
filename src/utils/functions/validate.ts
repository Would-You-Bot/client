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

const cronExpressionRegex =
  /^(\*|[0-9]{1,2}|\*\/[0-9]{1,2}) (\*|[0-9]{1,2}|\*\/[0-9]{1,2}) (\*|[0-9]{1,2}|\*\/[0-9]{1,2}) (\*|[0-9]{1,2}|\*\/[0-9]{1,2}) (\*|[0-9]{1,2}|\*\/[0-9]{1,2})$/;

/**
 * Validate a cron expression.
 * @param expression The cron expression to validate.
 * @returns Whether the cron expression is valid.
 */
export const validateCronExpression = (expression: string): boolean => cronExpressionRegex.test(expression);

/**
 * Convert a time to cron time.
 * @param time The time to convert to cron time.
 * @returns The converted time.
 */
export const timeToCronExpression = (time: string): string | null => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regular expression to validate HH:MM format

  // Check if the time matches the HH:MM format
  if (timeRegex.test(time)) {
    const [hours, minutes] = time.split(':');

    // Format hours and minutes for cron time
    const cronHours = hours === '00' ? '0' : hours.replace(/^0+/, ''); // Remove leading zeros, except for '00'
    const cronMinutes = minutes.replace(/^0+/, ''); // Remove leading zeros

    return `${cronMinutes} ${cronHours} * * *`; // Return the cron time format
  }

  return null; // Return null if the time is invalid
};

/**
 * Validate a time.
 * @param time The time to validate.
 * @returns Whether the time is valid.
 */
export const validateTime = (time: string): boolean => {
  const timeRegex = /^(?:[01]\d|2[0-3]):(?:00|30)$/; // Regular expression to validate HH:MM format
  return timeRegex.test(time);
};

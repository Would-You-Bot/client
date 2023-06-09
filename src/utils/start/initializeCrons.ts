import { tests } from 'builder-validation';
import { CronJob } from 'cron';

import { CoreCronOptions, CoreCustomCronOptions } from '@typings/core';
import { loadFiles } from '@utils/client';
import { validateAndFormatTimezone } from '@utils/functions';
import { ExtendedClient } from 'src/client';

/**
 * Initialize all the crons.
 * @param client The extended client.
 */
const initializeCrons = async (client: ExtendedClient): Promise<void> => {
  // Get all of the custom cron file names
  const customCronFiles = await loadFiles('crons/custom');

  for (const customCronFile of customCronFiles) {
    client.logger.debug(`Importing custom cron: ${customCronFile}`);

    // Load the custom cron
    const customCron = (
      (await import(`../../crons/custom/${customCronFile}`)) as {
        default: CoreCustomCronOptions;
      }
    ).default;

    client.logger.debug(`Initializing custom cron: ${customCron.name} (${customCron.id})`);

    // Execute the custon cron
    customCron.execute(client);
  }

  // Get all of the client cron file names
  const clientCronFileNames = await loadFiles('crons/client');

  for (const clientCronFile of clientCronFileNames) {
    client.logger.debug(`Importing client cron: ${clientCronFile}`);

    // Load the client cron
    const clientCron = (
      (await import(`../../crons/client/${clientCronFile}`)) as {
        default: CoreCronOptions;
      }
    ).default;

    // Validate the cron expression
    if (!tests.testCronExpression(clientCron.expression)) {
      client.logger.error(`Invalid cron expression for ${clientCron.name} (${clientCron.id})`);
      return;
    }

    // Validate the timezone
    const timezone = validateAndFormatTimezone(clientCron.timezone);

    // If the timezone is invalid, log an error and return
    if (!timezone) {
      client.logger.error(`Invalid timezone for ${clientCron.name} (${clientCron.id})`);
      return;
    }

    // Create the cron job for the client cron
    const job = new CronJob(
      clientCron.expression,
      () => {
        client.logger.debug(`Running cron: ${clientCron.name} (${clientCron.id})`);
        clientCron.execute(client);
      },
      null,
      false,
      clientCron.timezone
    );

    // Start the cron job
    job.start();
  }
};

export default initializeCrons;

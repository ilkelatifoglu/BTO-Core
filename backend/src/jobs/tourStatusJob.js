// src/jobs/tourStatusJob.js

const cron = require('node-cron');
const dayjs = require('dayjs');
const { query } = require('../config/database');
require('dotenv').config();

/**
 * Function to update tour_status from 'APPROVED' to 'READY' if within 2 weeks.
 */
async function checkAndSetToursReady() {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const twoWeeksLater = dayjs().add(14, 'day').format('YYYY-MM-DD');

    // Select tours that are APPROVED and within 2 weeks
    const selectQuery = `
      SELECT id, date, tour_status
      FROM tours
      WHERE tour_status = 'APPROVED'
        AND date <= $1::date
        AND date >= $2::date
    `;

    const result = await query(selectQuery, [twoWeeksLater, currentDate]);

    if (result.rows.length === 0) {
      console.log("No tours need to be updated from APPROVED to READY.");
      return;
    }

    const tourIds = result.rows.map(row => row.id);

    // Update selected tours to READY
    const updateQuery = `
      UPDATE tours
      SET tour_status = 'READY'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [tourIds]);

    console.log(`Updated ${tourIds.length} tours from APPROVED to READY.`);
  } catch (error) {
    console.error("Error updating tours to READY:", error.message || error);
  }
}

/**
 * Function to update tour_status from 'READY' to 'DONE' for completed tours.
 * @param {string} tourTime - The scheduled time of the tour (e.g., '09:00').
 */
async function updateTourStatusToDone(tourTime) {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');

    // Select tours that are READY, scheduled for today at tourTime
    const selectQuery = `
      SELECT id, date, time, tour_status
      FROM tours
      WHERE tour_status = 'READY'
        AND date = $1::date
        AND time = $2::time
    `;

    const result = await query(selectQuery, [currentDate, tourTime]);

    if (result.rows.length === 0) {
      console.log(`No READY tours found for time ${tourTime} on ${currentDate}.`);
      return;
    }

    const tourIds = result.rows.map(row => row.id);

    // Update selected tours to DONE
    const updateQuery = `
      UPDATE tours
      SET tour_status = 'DONE'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [tourIds]);

    console.log(`Updated ${tourIds.length} tours from READY to DONE for time ${tourTime} on ${currentDate}.`);
  } catch (error) {
    console.error(`Error updating tours to DONE for time ${tourTime}:`, error.message || error);
  }
}

/**
 * Schedule the job to run daily at 00:05 AM.
 * Cron format: minute, hour, dayOfMonth, month, dayOfWeek
 * '5 0 * * *' means: at 00:05 every day.
 */
function scheduleSetToursReady() {
  cron.schedule('5 0 * * *', async () => {
    console.log("Running daily tour status check at 00:05 AM...");
    await checkAndSetToursReady();
  }, {
    timezone: 'Europe/Istanbul' // Adjust timezone if needed
  });

  console.log("Tour status scheduler initialized. It will run daily at 00:05 AM.");
}

/**
 * Schedule the job to run at specific times:
 * 09:05, 11:05, 13:35, 16:05 every day.
 */
function scheduleSetToursDone() {
  // Define the times when the jobs should run
  const jobTimes = [
    { cronTime: '5 9 * * *', tourTime: '09:00' },
    { cronTime: '5 11 * * *', tourTime: '11:00' },
    { cronTime: '35 13 * * *', tourTime: '13:30' },
    { cronTime: '5 16 * * *', tourTime: '16:00' },
  ];

  jobTimes.forEach(({ cronTime, tourTime }) => {
    cron.schedule(cronTime, async () => {
      console.log(`Running tour status update at ${dayjs().format('HH:mm')} for tour time ${tourTime}...`);
      await updateTourStatusToDone(tourTime);
    }, {
      timezone: 'Europe/Istanbul', // Adjust timezone as needed
    });

    console.log(`Scheduled tour status update job for tour time ${tourTime} at cron time '${cronTime}'.`);
  });

  console.log('Tour completion schedulers initialized.');
}

module.exports = {
  scheduleSetToursReady,
  scheduleSetToursDone,
  checkAndSetToursReady, // Exported for manual invocation if needed
  updateTourStatusToDone, // Exported for manual invocation if needed
};

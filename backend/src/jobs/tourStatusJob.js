// src/jobs/tourStatusJob.js

const cron = require('node-cron');
const dayjs = require('dayjs');
const { query } = require('../config/database');
const { generateFeedbackToken } = require('../utils/jwt');
const emailService = require('../services/EmailService');
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
// Method to handle `individual_tours`
async function checkAndSetToursReadyForIndividualTours() {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const twoWeeksLater = dayjs().add(14, 'day').format('YYYY-MM-DD');

    // Select `individual_tours` that meet the criteria
    const selectQuery = `
      SELECT id, date, tour_status
      FROM individual_tours
      WHERE tour_status = 'APPROVED'
        AND date <= $1::date
        AND date >= $2::date
    `;

    const result = await query(selectQuery, [twoWeeksLater, currentDate]);

    if (result.rows.length === 0) {
      console.log("No individual tours need to be updated from APPROVED to READY.");
      return;
    }

    const individualTourIds = result.rows.map(row => row.id);

    // Update selected individual tours to `READY`
    const updateQuery = `
      UPDATE individual_tours
      SET tour_status = 'READY'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [individualTourIds]);

    console.log(`Updated ${individualTourIds.length} individual tours from APPROVED to READY.`);
  } catch (error) {
    console.error("Error updating individual tours to READY:", error.message || error);
  }
}
async function checkAndSetFairsReady() {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');
    const twoWeeksLater = dayjs().add(14, 'day').format('YYYY-MM-DD');

    // Select fairs that are APPROVED and within 2 weeks
    const selectQuery = `
      SELECT id, date, status
      FROM fairs
      WHERE status = 'APPROVED'
        AND date <= $1::date
        AND date >= $2::date
    `;

    const result = await query(selectQuery, [twoWeeksLater, currentDate]);

    if (result.rows.length === 0) {
      console.log("No fairs need to be updated from APPROVED to READY.");
      return;
    }

    const fairIds = result.rows.map(row => row.id);

    // Update selected fairs to READY
    const updateQuery = `
      UPDATE fairs
      SET status = 'READY'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [fairIds]);

    console.log(`Updated ${fairIds.length} fairs from APPROVED to READY.`);
  } catch (error) {
    console.error("Error updating fairs to READY:", error.message || error);
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
        AND time = $2
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
async function updateIndividualTourStatusToDone(tourTime) {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');

    // Select individual tours that are READY, scheduled for today at tourTime
    const selectQuery = `
      SELECT id, date, time, tour_status
      FROM individual_tours
      WHERE tour_status = 'READY'
        AND date = $1::date
        AND time = $2
    `;

    const result = await query(selectQuery, [currentDate, tourTime]);

    if (result.rows.length === 0) {
      console.log(`No READY individual tours found for time ${tourTime} on ${currentDate}.`);
      return;
    }

    const individualTourIds = result.rows.map(row => row.id);

    // Update selected individual tours to DONE
    const updateQuery = `
      UPDATE individual_tours
      SET tour_status = 'DONE'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [individualTourIds]);

    console.log(`Updated ${individualTourIds.length} individual tours from READY to DONE for time ${tourTime} on ${currentDate}.`);
  } catch (error) {
    console.error(`Error updating individual tours to DONE for time ${tourTime}:`, error.message || error);
  }
}
async function updateFairStatusToDone() {
  try {
    const currentDate = dayjs().format('YYYY-MM-DD');

    // Select fairs that are READY and scheduled for today
    const selectQuery = `
      SELECT id, date, fair_status
      FROM fairs
      WHERE fair_status = 'READY'
        AND date = $1::date
    `;

    const result = await query(selectQuery, [currentDate]);

    if (result.rows.length === 0) {
      console.log(`No READY fairs found for ${currentDate}.`);
      return;
    }

    const fairIds = result.rows.map(row => row.id);

    // Update selected fairs to DONE
    const updateQuery = `
      UPDATE fairs
      SET fair_status = 'DONE'
      WHERE id = ANY($1::int[])
    `;

    await query(updateQuery, [fairIds]);

    console.log(`Updated ${fairIds.length} fairs from READY to DONE for ${currentDate}.`);
  } catch (error) {
    console.error(`Error updating fairs to DONE for ${currentDate}:`, error.message || error);
  }
}

async function sendFeedbackLinksForCompletedTours() {
  try {
    const currentDate = dayjs().format("YYYY-MM-DD");

    const selectToursQuery = `
      SELECT 
        t.id, t.teacher_email AS school_email, s.school_name, t.date AS tour_date, t.time, 'tour' AS type
      FROM tours t
      JOIN schools s ON t.school_id = s.id
      WHERE t.tour_status = 'DONE' AND t.feedback_sent = false
    `;

    const selectIndividualToursQuery = `
      SELECT 
        id, contact_email AS school_email, contact_name AS school_name, date AS tour_date, time, 'individual_tour' AS type
      FROM individual_tours
      WHERE tour_status = 'DONE' AND feedback_sent = false
    `;

    const [toursResult, individualToursResult] = await Promise.all([
      query(selectToursQuery),
      query(selectIndividualToursQuery),
    ]);

    const allTours = [...toursResult.rows, ...individualToursResult.rows];

    if (allTours.length === 0) {
      console.log("No tours or individual tours with feedback pending.");
      return;
    }

    for (const tour of allTours) {
      const { id, school_email, school_name, tour_date, time, type } = tour;

      console.log(`Processing feedback for ID: ${id}, Type: ${type}`);

      const updateQuery = `
        UPDATE ${type === "tour" ? "tours" : "individual_tours"}
        SET feedback_sent = true
        WHERE id = $1
      `;
      await query(updateQuery, [id]);

      const feedbackToken = generateFeedbackToken(id, tour_date, type);

      const FRONTEND_URL = process.env.FRONTEND_URL;
      const feedbackLink = `${FRONTEND_URL}/school-feedback?token=${feedbackToken}`;

      await emailService.sendFeedbackRequestEmail(school_email, {
        name: school_name,
        tour_date,
        time,
        feedback_link: feedbackLink,
      });

      console.log(`Feedback link sent to ${school_email} for ${type} ID ${id}.`);
    }
  } catch (error) {
    console.error("Error sending feedback links:", error.message || error);
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
    await checkAndSetToursReadyForIndividualTours();
    await checkAndSetFairsReady();
  }, {
    timezone: 'Europe/Istanbul' // Adjust timezone if needed
  });

  console.log("Tour status scheduler initialized. It will run daily at 00:05 AM.");
}

function scheduleSendFeedbackLinks() {
  cron.schedule('0 8 * * *', async () => {
    console.log("Running daily feedback link job at 8:00 AM...");
    await sendFeedbackLinksForCompletedTours();
  }, {
    timezone: 'Europe/Istanbul',
  });

  console.log("Feedback link scheduler initialized. It will run daily at 8:00 AM.");
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

  // Schedule individual tours for each hour from 9 AM to 5 PM
  const individualTourTimes = Array.from({ length: 9 }, (_, i) => i + 9); // [9, 10, 11, ..., 17]
  individualTourTimes.forEach((hour) => {
    const cronTime = `5 ${hour} * * *`; // Run at 5 minutes past the hour
    const tourTime = `${String(hour).padStart(2, '0')}:00`; // Format as HH:00

    cron.schedule(cronTime, async () => {
      console.log(`Running individual tour status update at ${dayjs().format('HH:mm')} for tour time ${tourTime}...`);
      await updateIndividualTourStatusToDone(tourTime);
    }, {
      timezone: 'Europe/Istanbul', // Adjust timezone as needed
    });

    console.log(`Scheduled individual tour status update job for tour time ${tourTime} at cron time '${cronTime}'.`);
  });

  console.log('Tour completion schedulers initialized.');
}
function scheduleSetFairsDone() {
  const cronTime = '0 20 * * *'; // At 8:00 PM every day

  cron.schedule(cronTime, async () => {
    console.log(`Running fair status update at ${dayjs().format('HH:mm')}...`);
    await updateFairStatusToDone();
  }, {
    timezone: 'Europe/Istanbul', // Adjust timezone as needed
  });

  console.log(`Scheduled fair status update job to run at 8:00 PM daily.`);
}

module.exports = {
  scheduleSetToursReady,
  scheduleSetToursDone,
  scheduleSendFeedbackLinks,
  checkAndSetToursReady, // Exported for manual invocation if needed
  updateTourStatusToDone, // Exported for manual invocation if needed
  sendFeedbackLinksForCompletedTours,
  checkAndSetToursReadyForIndividualTours,
  updateIndividualTourStatusToDone,
  checkAndSetFairsReady,
  updateFairStatusToDone,
  scheduleSetFairsDone
};

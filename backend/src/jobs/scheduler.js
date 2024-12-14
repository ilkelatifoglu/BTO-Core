const {
  scheduleSetToursReady,
  scheduleSetToursDone,
  scheduleSendFeedbackLinks,
  scheduleSetFairsDone
} = require('./tourStatusJob');

function initializeSchedulers() {
  scheduleSetToursReady();
  scheduleSetToursDone();
  scheduleSendFeedbackLinks();
  scheduleSetFairsDone();
}

module.exports = initializeSchedulers;

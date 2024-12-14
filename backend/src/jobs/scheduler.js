const { 
  scheduleSetToursReady, 
  scheduleSetToursDone,
  scheduleSendFeedbackLinks
} = require('./tourStatusJob');

function initializeSchedulers() {
  scheduleSetToursReady();
  scheduleSetToursDone();
  scheduleSendFeedbackLinks();
}

module.exports = initializeSchedulers;

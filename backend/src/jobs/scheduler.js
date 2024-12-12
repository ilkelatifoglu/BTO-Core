// src/jobs/scheduler.js

const { 
    scheduleSetToursReady, 
    scheduleSetToursDone 
  } = require('./tourStatusJob');
  
  function initializeSchedulers() {
    scheduleSetToursReady();
    scheduleSetToursDone();
  }
  
  initializeSchedulers(); 
  
  module.exports = initializeSchedulers;
  
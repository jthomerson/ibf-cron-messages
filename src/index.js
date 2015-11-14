var _ = require('underscore'),
    CronJob = require('cron').CronJob;

/**
 * Sends messsages on a specified cron schedule.
 */
module.exports = function(client, IBF) {

   // TODO: fix IBF so that plugins don't need to get their config from a private variable
   var jobConfigs = client._config.plugins['cron-messages'],
       jobs;

   client.on('ready', function() {
      IBF.logger.trace('starting cron jobs');
      _.each(jobs, function(job) {
         job.start();
      });
   });

   function perform(jobConfig) {
      IBF.logger.trace('cron [%s][%s]: %s', jobConfig.schedule, jobConfig.channel, jobConfig.message);
      client.say(jobConfig.channel, jobConfig.message);
   }

   jobs = _.map(jobConfigs, function(jobConfig) {
      return new CronJob({
         cronTime: jobConfig.schedule,
         onTick: perform.bind(null, jobConfig),
         start: false
      });
   });

};

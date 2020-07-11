// ##############################
// // // Tasks for TasksCard - see Dashboard view
// #############################

var bugs = [
  'Sign contract for "What are conference organizers afraid of?"',
  "Lines From Great Russian Literature? Or E-mails From My Boss?",
  "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
  "Create 4 Invisible User Experiences you Never Knew About"
];
var website = [
  "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
  'Sign contract for "What are conference organizers afraid of?"'
];
var server = [
  "Lines From Great Russian Literature? Or E-mails From My Boss?",
  "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
  'Sign contract for "What are conference organizers afraid of?"'
];
var base_url = "http://127.0.0.1:8003/";

var access = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ2ODY5ODAyLCJqdGkiOiI3MDQxZjJkZGE5OTg0ZmFkYjZkN2VjNmNhMTg3NzM3MiIsInVzZXJfaWQiOjF9.wOE580zk4SF32N9-EEzB1coOIQajPQl9TyYWeETJFek";

module.exports = {
  // these 3 are used to create the tasks lists in TasksCard - Dashboard view
  bugs,
  website,
  server,
  base_url,
  access,
};

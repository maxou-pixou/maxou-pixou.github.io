const ENVIRONMENT = getEnvironment();

let API_URL = "";
let APP_URL = "";

if (ENVIRONMENT === "development") {
  API_URL = "http://localhost:8080";
  APP_URL = "http://localhost:3000";
}

if (ENVIRONMENT === "production") {
  APP_URL = "https://boilerplate-app.cleverapps.io/ ";
  API_URL = "https://boilerplate-api.cleverapps.io/";
}

const SENTRY_URL = "";

function getEnvironment() {
  if (window.location.href.indexOf("app-staging") !== -1) return "staging";
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) return "development";
  return "production";
}

export { API_URL, APP_URL, ENVIRONMENT, SENTRY_URL };

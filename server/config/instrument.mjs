import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://7a7e71abadbcdc924d89a5ed41b5c928@o4510747689156608.ingest.us.sentry.io/4510747700101120",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
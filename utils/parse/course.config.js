export default {
  "core": {
    "url": process.env.CORE_SERVER_URL,
    "apiKey": process.env.CORE_PARSE_REST_API_KEY,
    "applicationId": process.env.CORE_PARSE_APPLICATION_ID
  },
  "m1": {
    "url": process.env.M1_SERVER_URL,
    "apiKey": process.env.M1_PARSE_REST_API_KEY,
    "applicationId": process.env.M1_PARSE_APPLICATION_ID
  },
  "m2": {
    "url": process.env.M2_SERVER_URL,
    "apiKey": process.env.M2_PARSE_REST_API_KEY,
    "applicationId": process.env.M2_PARSE_APPLICATION_ID
  }
};
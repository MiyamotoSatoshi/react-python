// Express: http://localhost:3000/api/v0
// Flask: http://localhost:5000/api/v0

module.exports = {
  apiBaseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v0"
};

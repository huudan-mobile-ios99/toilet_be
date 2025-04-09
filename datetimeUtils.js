// Function to format datetime
function formatDatetime(datetime) {
  if (!datetime) return null;
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  };
  return new Date(datetime).toLocaleString('en-US', options);
}

// Function to get current datetime
function getCurrentDatetime() {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  };
  return new Date().toLocaleString('en-US', options);
}
module.exports = {
  formatDatetime,
  getCurrentDatetime,
};
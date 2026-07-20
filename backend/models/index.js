const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db:', error);
    return { users: [], hospitals: [], appointments: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db:', error);
  }
};

module.exports = {
  readDB,
  writeDB
};

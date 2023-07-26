const url = "postgres://nynokspbxqgadj:45a184395e084e52ea9c5ffcdc47";

// Extraction des informations de l'URL PostgreSQL
const [dialect, credentials, host, port, db] = url.match(/(\w+):\/\/(\w+):(\w+)@([\w.-]+):(\d+)\/(\w+)/);

module.exports = {
  HOST: host,
  USER: credentials,
  PASSWORD: credentials,
  PORT: port,
  DB: db,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
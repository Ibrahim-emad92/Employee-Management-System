const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = (async () => {
    try {
        const pool = await new sql.ConnectionPool(config).connect();
        console.log('Connected to database');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err; 
    }
})();

module.exports = {
    sql,
    poolPromise
    
};


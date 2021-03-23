const DIR = 'dist';

module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "synchronize": true,
    "logging": true,
    "entities": [
        `${DIR}/entities/**.entity.{ts,js}`
    ],
    "migrations": [
        `${DIR}/migration/**.{ts,js}`
    ],
    "subscribers": [
        `${DIR}/subscriber/**.{ts,js}`
    ],
    "cli": {
        "entitiesDir": `${DIR}/entities`,
        "migrationsDir": `${DIR}/migration`,
        "subscribersDir": `${DIR}/subscriber`
    }
}
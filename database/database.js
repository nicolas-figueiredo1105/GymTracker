import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync("gymtracker.db");

export default db;
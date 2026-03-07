import db from "./database";

export function setupDatabase() {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS workouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

        CREATE TABLE IF NOT EXISTS exercices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workout_id INTEGER,
            name TEXT,
            initial_weight INTEGER
        );

        CREATE TABLE IF NOT EXISTS sets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_id INTEGER,
            reps INTEGER,
            weight REAL
        );
        `)
}

export function clearDatabase(){
    db.execSync(`
        DROP TABLE IF EXISTS sets;
        DROP TABLE IF EXISTS exercises;
        DROP TABLE IF EXISTS workouts;
        DROP TABLE IF EXISTS users
    `);
    
    console.log("Database cleared!");
}
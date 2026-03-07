import db from './database';

export const DatabaseService = {
    createUser(firstName, lastName, email, password) {
        db.runSync(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)", 
            [firstName, lastName, email, password]
        );
    },

    loginUser(email, password) {
        return db.getFirstSync(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, password]
        );
    },

    createWorkout(userId, name) {
        db.runSync(
            "INSERT INTO workouts (user_id, name) VALUES (?, ?)",
            [userId, name]
        )
    },

    getWorkouts(userId) {
        return db.getFirstSync(
            "SELECT * FROM workout WHERE user_id = ?",
            [userId]
        );
    },

    addExercise(workoutId, name, sets, initialWeight) {
        db.runSync(
            "INSERT INTO exercises (workout_id, name, sets, initial_weight) VALUES (?, ?, ?, ?)",
            [workoutId, name, sets, initialWeight]
        );
    },

    getExercises(workoutId) {
        return db.getAllSync(
            "SELECT * FROM exercises WHERE workout_id = ?",
            [workoutId] 
        );
    },

    addSet(exerciseId, reps, weight){
        db.runSync(
            "INSERT INTO sets (exercise_id, reps, weight) VALUES (?, ?, ?)",
            [exerciseId, reps, weight]
        );
    },

    getSets(exerciseId) {
        return db.getAllSync(
            "SELECT * FROM sets WHERE exercise_id = ?",
            [exerciseId]
        );
    },
}
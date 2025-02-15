"use server";
import { neon } from "@neondatabase/serverless";
import bcryptjs from "bcryptjs";
import { signIn, signOut }  from '../pages/api/auth/[...nextauth]';


// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL || "");

// Function to authenticate user
export async function authenticate(username: string, password: string) {
  try {
    // const user = await getUserByUsername(username);
    const user = await signIn('credentials', { username, password, redirect: false }) // Use;
    console.log("User: ", user);
    if (!user) {
      throw new Error("User not found");
    }

    // const isMatch = await bcryptjs.compare(password, user.password);

    // if (!isMatch) {
    //   throw new Error("Invalid credentials");
    // }
    console.log("User: ", user);
    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

// Function to create users table
export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Users table created successfully.");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

export async function createStatTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS gamestats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        winnings INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Stats table created successfully.");
  } catch (error) {
    console.error("Error creating stats table:", error);
  }
}

export async function handleWin(userId: number) {
  try {
    const result = await sql`
      SELECT * FROM gamestats WHERE user_id = ${userId}
    `;
    
    if (result.length === 0) {
      console.error(`User with user_id: ${userId} does not exist in gamestats`);
      return;
    }
    await sql`
      UPDATE gamestats
      SET winnings = winnings + 12,
          games_played = games_played + 1
      WHERE user_id = ${userId};`
    console.log(`Updated winnings and games_played for user_id: ${userId}`);
  } catch (error) {
    console.error("Error updating winnings:", error);
  }
}

export async function getUserStats(userId: number) {
  try {
    const result = await sql`
      SELECT * FROM gamestats WHERE user_id = ${userId}
    `;
    return result ? result[0] : null;
  } catch (error) {
    console.error("Error retrieving user stats:", error);
    return null;
  }
}

export async function handleLoss(userId: number) {
  try {
    const result = await sql`
      SELECT * FROM gamestats WHERE user_id = ${userId}
    `;
    
    if (result.length === 0) {
      console.error(`User with user_id: ${userId} does not exist in gamestats`);
      return;
    } 
    await sql`
      UPDATE gamestats
      SET losses = losses + 1,
          games_played = games_played + 1
      WHERE user_id = ${userId};
    `;
    console.log(`Updated losses and games_played for user_id: ${userId}`);

  } catch (error) {
    console.error("Error updating losses:", error);
  }
}

// Function to retrieve user by username
export async function getUserByUsername(username: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;
    return result ? result[0] : null;
  } catch (error) {
    console.error("Error retrieving user by username:", error);
    return null;
  }
}

// Function to insert new user into the database
export async function createUser(username: string, password: string) {
  try {
    // Check if username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already taken");
    }

    // Hash the password asynchronously
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the new user into the database
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;
    console.log("User inserted successfully.");
    return { success: true }; // Return something to indicate success
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Logout function - to be called server-side
export async function logout() {
  try {
    // Clear cookies or session
    await signOut({ redirect: false });
    // response.clearCookies('next-auth.session-token'); // You may need to adjust based on your session management
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out user:", error);
  }
}

export async function populateGameStats() {
  try {
    // Get all users from the users table
    const users = await sql`
      SELECT id FROM users
    `;

    // Insert a new row into the gamestats table for each user
    for (const user of users) {
      await sql`
        INSERT INTO gamestats (user_id)
        VALUES (${user.id})
        ON CONFLICT (user_id) DO NOTHING
      `;
    }

    console.log("Gamestats table populated successfully.");
  } catch (error) {
    console.error("Error populating gamestats table:", error);
  }
}

export async function initializeApp() {
  await populateGameStats();
  
}

initializeApp().catch(console.error);
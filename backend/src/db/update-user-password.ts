import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateUserPassword() {
  try {
    // Hash the password "password123"
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Update the user's password
    await pool.query(
      'UPDATE "User" SET password = $1 WHERE email = $2',
      [hashedPassword, 'developer@example.com']
    );
    
    console.log('✅ Password updated successfully!');
    console.log('📧 Email: developer@example.com');
    console.log('🔑 Password: password123');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await pool.end();
  }
}

updateUserPassword();
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedRoadmap() {
  console.log('🚀 Starting roadmap data seeding...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'load-roadmap-data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📝 Executing SQL script...');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Roadmap data loaded successfully!');
    
    // Verify the data
    const { rows: phases } = await pool.query('SELECT COUNT(*) FROM "Phase"');
    const { rows: months } = await pool.query('SELECT COUNT(*) FROM "Month"');
    const { rows: weeks } = await pool.query('SELECT COUNT(*) FROM "Week"');
    const { rows: resources } = await pool.query('SELECT COUNT(*) FROM "Resource"');
    
    console.log(`📊 Data summary:
    - Phases: ${phases[0].count}
    - Months: ${months[0].count}
    - Weeks: ${weeks[0].count}
    - Resources: ${resources[0].count}`);
    
  } catch (error) {
    console.error('❌ Error seeding roadmap data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Check for command line arguments
const args = process.argv.slice(2);
const forceOverride = args.includes('--force');

if (!forceOverride) {
  console.log('⚠️  WARNING: This will override all existing data in your database!');
  console.log('To proceed, run with --force flag:');
  console.log('npm run seed:roadmap -- --force');
  process.exit(0);
}

seedRoadmap().catch(console.error);
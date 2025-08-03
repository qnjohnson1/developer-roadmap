import { pool } from './pool';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join } from 'path';

// Run the schema SQL first
async function runSchema() {
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schema);
    console.log('✅ Database schema created');
  } catch (error) {
    console.error('❌ Error creating schema:', error);
    throw error;
  }
}

// Create a test user
async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const result = await pool.query(
      `INSERT INTO "User" (email, password, name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE 
       SET password = $2, name = $3
       RETURNING id`,
      ['test@example.com', hashedPassword, 'Test User']
    );
    return result.rows[0].id;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

// Seed the roadmap data
async function seedRoadmap(userId: string) {
  try {
    // Phase 1: Foundations
    const phase1 = await pool.query(
      `INSERT INTO "Phase" (number, title, goal, "userId") 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [1, 'Foundations', 'Build CS fundamentals and prep for hardware/game dev', userId]
    );
    const phase1Id = phase1.rows[0].id;

    // Month 1: Computer Systems Basics
    const month1 = await pool.query(
      `INSERT INTO "Month" ("phaseId", number, title) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [phase1Id, 1, 'Computer Systems Basics']
    );
    const month1Id = month1.rows[0].id;

    // Month 1 Resources
    const month1Resources = [
      { title: '"Code: The Hidden Language" by Charles Petzold', type: 'book' },
      { title: 'Ben Eater\'s YouTube: "Build an 8-bit CPU"', type: 'video', url: 'https://www.youtube.com/playlist?list=PLowKtXNTBypGqImE405J2565dvjafglHU' },
      { title: 'nand2tetris.org (free course)', type: 'website', url: 'https://www.nand2tetris.org/' },
      { title: 'Book: "Computer Systems: A Programmer\'s Perspective"', type: 'book' }
    ];

    for (const resource of month1Resources) {
      await pool.query(
        `INSERT INTO "Resource" ("monthId", title, url, type) 
         VALUES ($1, $2, $3, $4)`,
        [month1Id, resource.title, resource.url || null, resource.type]
      );
    }

    // Week 1-2: CPU & Memory Fundamentals
    const week1 = await pool.query(
      `INSERT INTO "Week" ("monthId", number, title, focus) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [month1Id, 1, 'Week 1-2', 'CPU & Memory Fundamentals']
    );
    const week1Id = week1.rows[0].id;

    // Days and TimeBlocks for Week 1
    const week1Schedule = [
      {
        dayName: 'Monday',
        dayIndex: 1,
        blocks: [
          { duration: '45min', type: 'theory', description: 'Code Ch 1-3', order: 1 },
          { duration: '30min', type: 'practice', description: 'Notes', order: 2 }
        ]
      },
      {
        dayName: 'Wednesday',
        dayIndex: 3,
        blocks: [
          { duration: '45min', type: 'theory', description: 'Code Ch 4-6', order: 1 },
          { duration: '30min', type: 'practice', description: 'Exercises', order: 2 }
        ]
      },
      {
        dayName: 'Saturday',
        dayIndex: 6,
        blocks: [
          { duration: '2hr', type: 'project', description: 'Start VM in C#', order: 1 }
        ]
      }
    ];

    for (const day of week1Schedule) {
      const dayResult = await pool.query(
        `INSERT INTO "Day" ("weekId", "dayName", "dayIndex") 
         VALUES ($1, $2, $3) 
         RETURNING id`,
        [week1Id, day.dayName, day.dayIndex]
      );
      const dayId = dayResult.rows[0].id;

      for (const block of day.blocks) {
        await pool.query(
          `INSERT INTO "TimeBlock" ("dayId", duration, type, description, "order") 
           VALUES ($1, $2, $3, $4, $5)`,
          [dayId, block.duration, block.type, block.description, block.order]
        );
      }
    }

    // Add more months, weeks, and days as needed...
    // For now, let's add Month 2 and Month 3 to complete Phase 1

    // Month 2: Systems Deep Dive
    await pool.query(
      `INSERT INTO "Month" ("phaseId", number, title) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [phase1Id, 2, 'Systems Deep Dive']
    );

    // Month 3: Game Programming Basics
    await pool.query(
      `INSERT INTO "Month" ("phaseId", number, title) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [phase1Id, 3, 'Game Programming Basics']
    );

    // Phase 2: Hardware Simulation
    await pool.query(
      `INSERT INTO "Phase" (number, title, goal, "userId") 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [2, 'Hardware Simulation', 'Learn hardware concepts without buying equipment yet', userId]
    );

    // Phase 3: 3D Game Development
    await pool.query(
      `INSERT INTO "Phase" (number, title, goal, "userId") 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [3, '3D Game Development', 'Start 3D game dev with your programming focus', userId]
    );

    // Phase 4: Integration & Physical Computing
    await pool.query(
      `INSERT INTO "Phase" (number, title, goal, "userId") 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [4, 'Integration & Physical Computing', 'Combine everything with real hardware', userId]
    );

    console.log('✅ Roadmap data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding roadmap:', error);
    throw error;
  }
}

// Clean existing data
async function cleanDatabase() {
  try {
    console.log('🧹 Cleaning existing data...');
    
    // Delete in reverse order of foreign key dependencies
    await pool.query('DELETE FROM "ProgressLog"');
    await pool.query('DELETE FROM "Note"');
    await pool.query('DELETE FROM "TimeBlock"');
    await pool.query('DELETE FROM "Day"');
    await pool.query('DELETE FROM "Week"');
    await pool.query('DELETE FROM "Resource"');
    await pool.query('DELETE FROM "Month"');
    await pool.query('DELETE FROM "Phase"');
    await pool.query('DELETE FROM "User"');
    
    console.log('✅ Database cleaned');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
}

// Main seed function
async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Check if we should run schema (skip if --no-schema flag is passed)
    const shouldRunSchema = !process.argv.includes('--no-schema');
    
    if (shouldRunSchema) {
      try {
        await runSchema();
      } catch (error: any) {
        if (error.code === '42710') { // Object already exists
          console.log('⚠️  Schema already exists, skipping creation');
        } else {
          throw error;
        }
      }
    }
    
    // Clean existing data if --clean flag is passed
    if (process.argv.includes('--clean')) {
      await cleanDatabase();
    }
    
    // Create test user
    const userId = await createTestUser();
    console.log('✅ Test user created');
    
    // Seed roadmap data
    await seedRoadmap(userId);
    
    console.log('🎉 Database seeded successfully!');
    console.log('📧 Test login: test@example.com / password123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seed
seed();
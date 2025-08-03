# Developer Roadmap Data

This directory contains the complete 12-month developer learning roadmap data that spans from CS fundamentals to hardware and game development.

## Data Structure Overview

The roadmap is organized hierarchically:
- **4 Phases**: Major learning phases (Foundations, Hardware Simulation, 3D Game Dev, Integration)
- **12 Months**: Each phase contains 3 months of focused learning
- **24 Weeks**: Each month is divided into 2 weeks
- **Days**: Each week contains specific study days
- **Time Blocks**: Each day has time blocks for theory, practice, and projects
- **48 Resources**: Learning materials including books, videos, websites, and tools

## Loading the Data

### Option 1: Quick Load (Recommended)
```bash
npm run seed:roadmap -- --force
```

### Option 2: Manual SQL Load
```bash
psql "postgresql://roadmap_user:roadmap_password@localhost:5432/developer_roadmap" -f src/db/load-roadmap-data.sql
```

### Option 3: Using Docker
```bash
docker exec -i roadmap-postgres psql -U roadmap_user -d developer_roadmap < backend/src/db/load-roadmap-data.sql
```

## Important Notes

1. **Data Override**: The seed script will TRUNCATE all existing data in the database tables. Always backup important data before running.

2. **User Account**: The script creates a sample user:
   - Email: developer@example.com
   - Password: (hashed version of a default password)
   - You should update this with your actual user data

3. **ID Format**: The data uses specific string IDs (e.g., 'phase-1', 'month-1') for easy reference and relationships.

## Roadmap Content

### Phase 1: Foundations (Months 1-3)
- Computer Systems Basics
- Systems Deep Dive
- Game Programming Basics

### Phase 2: Hardware Simulation (Months 4-6)
- Virtual Arduino Basics
- Advanced Simulation
- IoT Fundamentals

### Phase 3: 3D Game Development (Months 7-9)
- Unity/Godot Basics
- Procedural Generation
- Multiplayer Systems

### Phase 4: Integration & Physical Computing (Months 10-12)
- Real Hardware
- Space/Robotics Starter
- Capstone Project

## Customizing the Data

To customize the roadmap for your needs:

1. Edit `src/db/load-roadmap-data.sql`
2. Update the user ID and email to match your requirements
3. Modify phases, months, weeks, or time blocks as needed
4. Re-run the seed script

## Verifying the Data

After loading, you can verify the data:

```sql
-- Check phase counts
SELECT COUNT(*) FROM "Phase";

-- View all months with their phases
SELECT p.title as phase, m.number, m.title 
FROM "Month" m 
JOIN "Phase" p ON m."phaseId" = p.id 
ORDER BY m.number;

-- Check resources by type
SELECT type, COUNT(*) 
FROM "Resource" 
GROUP BY type;
```
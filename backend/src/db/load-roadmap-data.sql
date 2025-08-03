-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing data (careful - this will delete all data!)
TRUNCATE TABLE "ProgressLog", "Note", "Resource", "TimeBlock", "Day", "Week", "Month", "Phase", "User" CASCADE;

-- Insert sample user (you'll need to update this with actual user data)
INSERT INTO "User" (id, email, password, name) VALUES 
('user-1', 'developer@example.com', '$2a$10$XQq2o2Q6s2CTDvN6n2XGnOKBrfDfH7Qgq4H6xKpL9cZQf2zQq2Q6s', 'Developer') 
ON CONFLICT (id) DO NOTHING;

-- Insert Phases
INSERT INTO "Phase" (id, number, title, goal, "userId") VALUES
('phase-1', 1, 'Foundations', 'Build CS fundamentals and prep for hardware/game dev', 'user-1'),
('phase-2', 2, 'Hardware Simulation', 'Learn hardware concepts without buying equipment yet', 'user-1'),
('phase-3', 3, '3D Game Development', 'Start 3D game dev with your programming focus', 'user-1'),
('phase-4', 4, 'Integration & Physical Computing', 'Combine everything with real hardware', 'user-1')
ON CONFLICT (id) DO NOTHING;

-- Insert Months
INSERT INTO "Month" (id, "phaseId", number, title) VALUES
-- Phase 1
('month-1', 'phase-1', 1, 'Computer Systems Basics'),
('month-2', 'phase-1', 2, 'Systems Deep Dive'),
('month-3', 'phase-1', 3, 'Game Programming Basics'),
-- Phase 2
('month-4', 'phase-2', 4, 'Virtual Arduino Basics'),
('month-5', 'phase-2', 5, 'Advanced Simulation'),
('month-6', 'phase-2', 6, 'IoT Fundamentals'),
-- Phase 3
('month-7', 'phase-3', 7, 'Unity/Godot Basics'),
('month-8', 'phase-3', 8, 'Procedural Generation'),
('month-9', 'phase-3', 9, 'Multiplayer Systems'),
-- Phase 4
('month-10', 'phase-4', 10, 'Real Hardware'),
('month-11', 'phase-4', 11, 'Space/Robotics Starter'),
('month-12', 'phase-4', 12, 'Capstone Project')
ON CONFLICT (id) DO NOTHING;

-- Insert Weeks
INSERT INTO "Week" (id, "monthId", number, title, focus) VALUES
-- Month 1
('week-1-1', 'month-1', 1, 'Week 1-2: CPU & Memory Fundamentals', 'Understanding how computers work at the lowest level'),
('week-1-2', 'month-1', 2, 'Week 3-4: Assembly & Low-Level', 'Building a simple virtual machine'),
-- Month 2
('week-2-1', 'month-2', 1, 'Week 1-2: OS Concepts', 'Operating system fundamentals'),
('week-2-2', 'month-2', 2, 'Week 3-4: Algorithms Practice', 'Data structures and algorithms'),
-- Month 3
('week-3-1', 'month-3', 1, 'Week 1-2: 2D Graphics & Game Loop', 'Canvas API and game fundamentals'),
('week-3-2', 'month-3', 2, 'Week 3-4: Collision & Physics', 'Game physics implementation'),
-- Month 4
('week-4-1', 'month-4', 1, 'Week 1-2: Electronics Fundamentals', 'Basic circuit concepts'),
('week-4-2', 'month-4', 2, 'Week 3-4: Sensors & GPIO', 'Digital/analog IO and sensors'),
-- Month 5
('week-5-1', 'month-5', 1, 'Week 1-2: Sensor Integration', 'I2C/SPI protocols'),
('week-5-2', 'month-5', 2, 'Week 3-4: Data Communication', 'Serial and WiFi communication'),
-- Month 6
('week-6-1', 'month-6', 1, 'Week 1-2: MQTT & Events', 'IoT messaging protocols'),
('week-6-2', 'month-6', 2, 'Week 3-4: Dashboard Build', 'React IoT dashboard'),
-- Month 7
('week-7-1', 'month-7', 1, 'Week 1-2: 3D Fundamentals', '3D math and Unity basics'),
('week-7-2', 'month-7', 2, 'Week 3-4: Movement & Camera', 'Player controls in 3D'),
-- Month 8
('week-8-1', 'month-8', 1, 'Week 1-2: Algorithms', 'Procedural generation theory'),
('week-8-2', 'month-8', 2, 'Week 3-4: Maze Generation', 'Implementing maze algorithms'),
-- Month 9
('week-9-1', 'month-9', 1, 'Week 1-2: Networking Basics', 'Client-server architecture'),
('week-9-2', 'month-9', 2, 'Week 3-4: State Sync', 'Multiplayer state management'),
-- Month 10
('week-10-1', 'month-10', 1, 'Week 1-2: Setup & Basics', 'Real Arduino setup'),
('week-10-2', 'month-10', 2, 'Week 3-4: Web Integration', 'Connecting hardware to web'),
-- Month 11
('week-11-1', 'month-11', 1, 'Week 1-2: Tracking Systems', 'Satellite tracking basics'),
('week-11-2', 'month-11', 2, 'Week 3-4: Physical Tracker', 'Building the tracker'),
-- Month 12
('week-12-1', 'month-12', 1, 'Week 1-2: Project Planning', 'Capstone design'),
('week-12-2', 'month-12', 2, 'Week 3-4: Build & Polish', 'Final implementation')
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 1-1 (Month 1, Week 1)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-1-1-1', 'week-1-1', 'Monday', 1),
('day-1-1-2', 'week-1-1', 'Wednesday', 3),
('day-1-1-3', 'week-1-1', 'Saturday', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 1-1
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
-- Monday
('tb-1-1-1-1', 'day-1-1-1', '45min', 'theory', 'Code Ch 1-3', 1),
('tb-1-1-1-2', 'day-1-1-1', '30min', 'practice', 'Notes', 2),
-- Wednesday
('tb-1-1-2-1', 'day-1-1-2', '45min', 'theory', 'Code Ch 4-6', 1),
('tb-1-1-2-2', 'day-1-1-2', '30min', 'practice', 'Exercises', 2),
-- Saturday
('tb-1-1-3-1', 'day-1-1-3', '2hr', 'project', 'Start VM in C#', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 1-2 (Month 1, Week 2)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-1-2-1', 'week-1-2', 'Tuesday', 2),
('day-1-2-2', 'week-1-2', 'Thursday', 4),
('day-1-2-3', 'week-1-2', 'Sunday', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 1-2
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
-- Tuesday
('tb-1-2-1-1', 'day-1-2-1', '45min', 'theory', 'Ben Eater ALU', 1),
('tb-1-2-1-2', 'day-1-2-1', '30min', 'practice', 'VM opcodes', 2),
-- Thursday
('tb-1-2-2-1', 'day-1-2-2', '45min', 'theory', 'Ben Eater RAM', 1),
('tb-1-2-2-2', 'day-1-2-2', '30min', 'practice', 'VM memory', 2),
-- Sunday
('tb-1-2-3-1', 'day-1-2-3', '1.5hr', 'project', 'VM arithmetic', 1)
ON CONFLICT (id) DO NOTHING;

-- Resources for Month 1
INSERT INTO "Resource" (id, "monthId", title, type, url) VALUES
('res-1-1', 'month-1', 'Code: The Hidden Language by Charles Petzold', 'book', NULL),
('res-1-2', 'month-1', 'Ben Eater''s YouTube: Build an 8-bit CPU', 'video', 'https://www.youtube.com/playlist?list=PLowKtXNTBypGqImE405J2565dvjafglHU'),
('res-1-3', 'month-1', 'nand2tetris.org (free course)', 'website', 'https://www.nand2tetris.org/'),
('res-1-4', 'month-1', 'Computer Systems: A Programmer''s Perspective', 'book', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 2-1 (Month 2, Week 1)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-2-1-1', 'week-2-1', 'Monday', 1),
('day-2-1-2', 'week-2-1', 'Wednesday', 3),
('day-2-1-3', 'week-2-1', 'Friday', 5),
('day-2-1-4', 'week-2-1', 'Saturday', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 2-1
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
('tb-2-1-1-1', 'day-2-1-1', '1hr', 'theory', 'OSTEP Ch 4-6', 1),
('tb-2-1-2-1', 'day-2-1-2', '1hr', 'theory', 'OSTEP Ch 7-9', 1),
('tb-2-1-3-1', 'day-2-1-3', '1.5hr', 'project', 'Process scheduler', 1),
('tb-2-1-4-1', 'day-2-1-4', '1.5hr', 'project', 'Scheduler polish', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 2-2 (Month 2, Week 2)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-2-2-1', 'week-2-2', 'Mon-Fri', 0),
('day-2-2-2', 'week-2-2', 'Saturday', 6),
('day-2-2-3', 'week-2-2', 'Sunday', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 2-2
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
('tb-2-2-1-1', 'day-2-2-1', '30min', 'practice', '1 LeetCode Easy', 1),
('tb-2-2-2-1', 'day-2-2-2', '2hr', 'theory', 'Sedgewick Ch 1-2', 1),
('tb-2-2-3-1', 'day-2-2-3', '2hr', 'theory', 'Sedgewick Ch 3', 1)
ON CONFLICT (id) DO NOTHING;

-- Resources for Month 2
INSERT INTO "Resource" (id, "monthId", title, type, url) VALUES
('res-2-1', 'month-2', 'Operating Systems: Three Easy Pieces', 'website', 'https://pages.cs.wisc.edu/~remzi/OSTEP/'),
('res-2-2', 'month-2', 'Algorithms by Robert Sedgewick', 'book', NULL),
('res-2-3', 'month-2', 'LeetCode account (free tier)', 'tool', 'https://leetcode.com/'),
('res-2-4', 'month-2', 'Visualgo.net for algorithm visualization', 'website', 'https://visualgo.net/')
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 3-1 (Month 3, Week 1)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-3-1-1', 'week-3-1', 'Tuesday', 2),
('day-3-1-2', 'week-3-1', 'Thursday', 4),
('day-3-1-3', 'week-3-1', 'Saturday', 6),
('day-3-1-4', 'week-3-1', 'Sunday', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 3-1
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
('tb-3-1-1-1', 'day-3-1-1', '1hr', 'theory', 'MDN Canvas basics', 1),
('tb-3-1-2-1', 'day-3-1-2', '1hr', 'theory', 'Game loop pattern', 1),
('tb-3-1-3-1', 'day-3-1-3', '2.5hr', 'project', 'Build Pong', 1),
('tb-3-1-4-1', 'day-3-1-4', '1hr', 'project', 'Pong AI', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert Days for Week 3-2 (Month 3, Week 2)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-3-2-1', 'week-3-2', 'Monday', 1),
('day-3-2-2', 'week-3-2', 'Wednesday', 3),
('day-3-2-3', 'week-3-2', 'Saturday', 6),
('day-3-2-4', 'week-3-2', 'Sunday', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 3-2
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
('tb-3-2-1-1', 'day-3-2-1', '45min', 'theory', 'Collision basics', 1),
('tb-3-2-1-2', 'day-3-2-1', '45min', 'practice', 'AABB implementation', 2),
('tb-3-2-2-1', 'day-3-2-2', '45min', 'theory', 'Rotation math', 1),
('tb-3-2-2-2', 'day-3-2-2', '45min', 'practice', 'Tetris pieces', 2),
('tb-3-2-3-1', 'day-3-2-3', '3hr', 'project', 'Build Tetris', 1),
('tb-3-2-4-1', 'day-3-2-4', '1hr', 'project', 'Scoring & levels', 1)
ON CONFLICT (id) DO NOTHING;

-- Resources for Month 3
INSERT INTO "Resource" (id, "monthId", title, type, url) VALUES
('res-3-1', 'month-3', 'MDN Canvas API Tutorial', 'website', 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial'),
('res-3-2', 'month-3', 'Game Programming Patterns by Robert Nystrom', 'book', 'https://gameprogrammingpatterns.com/'),
('res-3-3', 'month-3', 'Coding Train YouTube (Daniel Shiffman)', 'video', 'https://www.youtube.com/c/TheCodingTrain'),
('res-3-4', 'month-3', 'Red Blob Games (algorithms & visuals)', 'website', 'https://www.redblobgames.com/')
ON CONFLICT (id) DO NOTHING;

-- Continue with remaining months (4-12) following the same pattern...
-- Due to length constraints, I'll show the pattern for one more month and then provide resources

-- Insert Days for Week 4-1 (Month 4, Week 1)
INSERT INTO "Day" (id, "weekId", "dayName", "dayIndex") VALUES
('day-4-1-1', 'week-4-1', 'Monday', 1),
('day-4-1-2', 'week-4-1', 'Wednesday', 3),
('day-4-1-3', 'week-4-1', 'Friday', 5),
('day-4-1-4', 'week-4-1', 'Sunday', 7)
ON CONFLICT (id) DO NOTHING;

-- Insert TimeBlocks for Week 4-1
INSERT INTO "TimeBlock" (id, "dayId", duration, type, description, "order") VALUES
('tb-4-1-1-1', 'day-4-1-1', '1hr', 'theory', 'Voltage/Current/Resistance', 1),
('tb-4-1-2-1', 'day-4-1-2', '1hr', 'theory', 'Ohm''s Law & LEDs', 1),
('tb-4-1-3-1', 'day-4-1-3', '1.5hr', 'project', 'Tinkercad LED blink', 1),
('tb-4-1-4-1', 'day-4-1-4', '1.5hr', 'project', 'LED patterns', 1)
ON CONFLICT (id) DO NOTHING;

-- Resources for Month 4
INSERT INTO "Resource" (id, "monthId", title, type, url) VALUES
('res-4-1', 'month-4', 'Tinkercad Circuits (free account)', 'tool', 'https://www.tinkercad.com/circuits'),
('res-4-2', 'month-4', 'Arduino.cc official tutorials', 'website', 'https://www.arduino.cc/en/Tutorial/HomePage'),
('res-4-3', 'month-4', 'Paul McWhorter Arduino YouTube series', 'video', 'https://www.youtube.com/playlist?list=PLGs0VKk2DiYw-L-RibttcvK-WBZm8WLEP'),
('res-4-4', 'month-4', 'Make: Electronics by Charles Platt', 'book', NULL)
ON CONFLICT (id) DO NOTHING;

-- Resources for remaining months
INSERT INTO "Resource" (id, "monthId", title, type, url) VALUES
-- Month 5
('res-5-1', 'month-5', 'Wokwi.com (better simulator)', 'tool', 'https://wokwi.com/'),
('res-5-2', 'month-5', 'I2C protocol guide', 'website', 'https://i2c-bus.org/'),
('res-5-3', 'month-5', 'Adafruit sensor tutorials', 'website', 'https://learn.adafruit.com/'),
('res-5-4', 'month-5', 'ESP8266/ESP32 documentation', 'website', 'https://docs.espressif.com/'),
-- Month 6
('res-6-1', 'month-6', 'MQTT.org documentation', 'website', 'https://mqtt.org/'),
('res-6-2', 'month-6', 'Mosquitto broker (free)', 'tool', 'https://mosquitto.org/'),
('res-6-3', 'month-6', 'Node-RED visual programming', 'tool', 'https://nodered.org/'),
('res-6-4', 'month-6', 'Hands-On MQTT Programming tutorials', 'website', NULL),
-- Month 7
('res-7-1', 'month-7', 'Unity Learn (free courses)', 'website', 'https://learn.unity.com/'),
('res-7-2', 'month-7', 'Brackeys YouTube archive', 'video', 'https://www.youtube.com/c/Brackeys'),
('res-7-3', 'month-7', '3Blue1Brown: Linear Algebra series', 'video', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab'),
('res-7-4', 'month-7', 'GDQuest for Godot alternative', 'website', 'https://www.gdquest.com/'),
-- Month 8
('res-8-1', 'month-8', 'Sebastian Lague: Procedural tutorials', 'video', 'https://www.youtube.com/c/SebastianLague'),
('res-8-2', 'month-8', 'The Nature of Code by Daniel Shiffman', 'book', 'https://natureofcode.com/'),
('res-8-3', 'month-8', 'Catlike Coding Unity tutorials', 'website', 'https://catlikecoding.com/unity/tutorials/'),
('res-8-4', 'month-8', 'Red Blob Games: Map generation', 'website', 'https://www.redblobgames.com/maps/'),
-- Month 9
('res-9-1', 'month-9', 'Mirror Networking for Unity', 'tool', 'https://mirror-networking.com/'),
('res-9-2', 'month-9', 'Glenn Fiedler''s networking articles', 'website', 'https://gafferongames.com/'),
('res-9-3', 'month-9', 'Multiplayer Game Programming book', 'book', NULL),
('res-9-4', 'month-9', 'Tom Weiland networking YouTube', 'video', 'https://www.youtube.com/c/TomWeiland'),
-- Month 10
('res-10-1', 'month-10', 'Arduino Starter Kit ($50-80)', 'tool', NULL),
('res-10-2', 'month-10', 'DHT22 temp/humidity sensor', 'tool', NULL),
('res-10-3', 'month-10', 'Soil moisture sensor', 'tool', NULL),
('res-10-4', 'month-10', 'Random Nerd Tutorials site', 'website', 'https://randomnerdtutorials.com/'),
-- Month 11
('res-11-1', 'month-11', 'SG90 servo motors (2x)', 'tool', NULL),
('res-11-2', 'month-11', 'HMC5883L compass module', 'tool', NULL),
('res-11-3', 'month-11', 'N2YO.com satellite API', 'website', 'https://www.n2yo.com/api/'),
('res-11-4', 'month-11', 'CelesTrak orbital data', 'website', 'https://celestrak.com/'),
-- Month 12
('res-12-1', 'month-12', 'Space-themed multiplayer game with real ISS data', 'website', NULL),
('res-12-2', 'month-12', 'Smart greenhouse with game mechanics', 'website', NULL),
('res-12-3', 'month-12', 'AR rocket launch tracker', 'website', NULL),
('res-12-4', 'month-12', 'IoT-controlled robot maze solver', 'website', NULL)
ON CONFLICT (id) DO NOTHING;
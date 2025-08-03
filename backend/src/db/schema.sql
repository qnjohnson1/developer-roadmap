-- Create tables for the developer roadmap application

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phases table
CREATE TABLE IF NOT EXISTS "Phase" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", number)
);

-- Months table
CREATE TABLE IF NOT EXISTS "Month" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "phaseId" TEXT NOT NULL REFERENCES "Phase"(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  progress DECIMAL DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("phaseId", number)
);

-- Weeks table
CREATE TABLE IF NOT EXISTS "Week" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "monthId" TEXT NOT NULL REFERENCES "Month"(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  focus TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("monthId", number)
);

-- Days table
CREATE TABLE IF NOT EXISTS "Day" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "weekId" TEXT NOT NULL REFERENCES "Week"(id) ON DELETE CASCADE,
  "dayName" TEXT NOT NULL,
  "dayIndex" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("weekId", "dayIndex")
);

-- TimeBlocks table
CREATE TABLE IF NOT EXISTS "TimeBlock" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "dayId" TEXT NOT NULL REFERENCES "Day"(id) ON DELETE CASCADE,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  "order" INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS "Resource" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "monthId" TEXT NOT NULL REFERENCES "Month"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE IF NOT EXISTS "Note" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ProgressLogs table
CREATE TABLE IF NOT EXISTS "ProgressLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "timeBlockId" TEXT NOT NULL REFERENCES "TimeBlock"(id) ON DELETE CASCADE,
  "actualDuration" INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "timeBlockId", date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_phase_user ON "Phase"("userId");
CREATE INDEX IF NOT EXISTS idx_month_phase ON "Month"("phaseId");
CREATE INDEX IF NOT EXISTS idx_week_month ON "Week"("monthId");
CREATE INDEX IF NOT EXISTS idx_day_week ON "Day"("weekId");
CREATE INDEX IF NOT EXISTS idx_timeblock_day ON "TimeBlock"("dayId");
CREATE INDEX IF NOT EXISTS idx_resource_month ON "Resource"("monthId");
CREATE INDEX IF NOT EXISTS idx_note_entity ON "Note"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS idx_progresslog_user ON "ProgressLog"("userId");

-- Create update trigger for updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phase_updated_at BEFORE UPDATE ON "Phase" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_month_updated_at BEFORE UPDATE ON "Month" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_week_updated_at BEFORE UPDATE ON "Week" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_day_updated_at BEFORE UPDATE ON "Day" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timeblock_updated_at BEFORE UPDATE ON "TimeBlock" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resource_updated_at BEFORE UPDATE ON "Resource" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_note_updated_at BEFORE UPDATE ON "Note" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progresslog_updated_at BEFORE UPDATE ON "ProgressLog" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
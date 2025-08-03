# Developer Roadmap Tracker

A full-stack application to track your developer learning journey with interactive progress tracking, resource management, and analytics.

## Features

- 📊 Interactive progress tracking for daily, weekly, and monthly goals
- 📚 Resource management with direct links and status tracking
- 📝 Note-taking for reflections and learnings
- 📈 Analytics dashboard with insights and progress visualization
- 🔄 Flexible scheduling with task rescheduling capabilities
- 🔐 User authentication and personalized roadmaps
- 💾 PostgreSQL persistence for all your data

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Query

## Getting Started

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd developer_roadmap
```

2. Start the database
```bash
docker-compose up -d
```

3. Install backend dependencies
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
```

4. Run database migrations
```bash
npm run migrate
npm run seed
```

5. Start the backend server
```bash
npm run dev
```

6. In a new terminal, install frontend dependencies
```bash
cd frontend
npm install
```

7. Start the frontend development server
```bash
npm run dev
```

8. Open http://localhost:5173 in your browser

## Development

### Backend API runs on: http://localhost:3000
### Frontend runs on: http://localhost:5173
### PostgreSQL runs on: localhost:5432

## Project Structure

```
developer-roadmap/
├── backend/          # Express API server
├── frontend/         # React application
├── shared/          # Shared TypeScript types
└── docker-compose.yml
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial roadmap data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
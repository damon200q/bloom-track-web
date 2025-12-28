# BloomTrack - Women's Health Tracker

## Overview

BloomTrack is a women's health tracking application that helps users understand their body's natural rhythms. The app provides fertility tracking with ovulation and fertile window calculations, pregnancy due date calculations, weight tracking during pregnancy, and postpartum wellness monitoring. The application uses a pink-themed, soft UI design focused on accessibility and ease of use.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom pink/rose theme colors, custom fonts (Quicksand, Outfit)
- **Animations**: Framer Motion for smooth transitions and result reveals
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod schemas for type-safe validation
- **Build Process**: esbuild for production bundling, Vite dev server for development with HMR

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Four main tables - cycles (fertility tracking), pregnancies (due date calculations), weight_entries (pregnancy weight), postpartum_checks (wellness monitoring)
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

### Project Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes and database access
- `/shared` - Shared types, schemas, and API route definitions used by both frontend and backend
- `/attached_assets` - Reference HTML files for UI design inspiration

### Key Design Patterns
- **Type Safety**: Shared Zod schemas between frontend and backend ensure consistent validation
- **API Contract**: Routes defined in shared/routes.ts with input/output schemas
- **Storage Abstraction**: IStorage interface in server/storage.ts allows for different storage implementations
- **Path Aliases**: `@/` for client source, `@shared/` for shared code

## External Dependencies

### Database
- PostgreSQL database (connection via DATABASE_URL environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for session storage capability

### UI Libraries
- Radix UI primitives (dialog, popover, tabs, etc.)
- react-day-picker for calendar component
- embla-carousel-react for carousel functionality
- vaul for drawer component

### Utility Libraries
- date-fns for date calculations and formatting
- zod for schema validation
- class-variance-authority for component variants
- clsx/tailwind-merge for class name handling

### Development Tools
- Replit-specific plugins for error overlay and development banner
- TypeScript for type checking
- PostCSS with Tailwind CSS and autoprefixer
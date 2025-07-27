# Image Generation Application

## Overview

This full-stack web application offers a new, energy-conscious approach to AI-powered image generation by prioritizing collaborative text refinement before a single pixel is rendered. Instead of relying on energy-intensive, trial-and-error image generation, users co-create richly detailed descriptions with the help of AI—refining their vision iteratively in natural language.

Why does this matter?
AI image generation models are significantly more resource-hungry than text-based models. Each image generated, especially at high quality, consumes far more energy than several rounds of text generation. By shifting the creative process to a text-first model, the tool dramatically cuts down on unnecessary image rendering—ensuring only the most aligned and intentional visions are brought to life.

To guide this process, the platform features whimsical creative themes like Cloud Fairycore, Ocean Mermaidia, and Forest Goblin—each with its own aesthetic vocabulary and vibe. These themes help users articulate their visual ideas more vividly in words, making the AI-generated image more accurate and meaningful, while reducing wasted compute power on vague or poorly scoped prompts.

This human-AI collaboration is more than efficient—it’s enchanting. Together, we craft the dream before casting the spell.

## User Preferences

Preferred communication style: Simple, everyday language.
Design aesthetic: Fairycore - whimsical, ethereal, delicate, soft but magical with energy awareness

## System Architecture

### Full-Stack Monorepo Structure
- **Frontend**: React with TypeScript, built with Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Development Environment
- **Build Tool**: Vite for frontend bundling and development server
- **Runtime**: Node.js with ES modules
- **TypeScript**: Strict mode enabled across the entire codebase
- **Package Manager**: npm with lockfile version 3

## Key Components

### Database Layer (Drizzle + PostgreSQL)
- **Schema Location**: `shared/schema.ts`
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Tables**:
  - `users`: User authentication and management
  - `image_generation_sessions`: Tracks the complete image generation workflow
- **Migrations**: Handled through Drizzle Kit with migrations stored in `./migrations`

### Backend Architecture (Express.js)
- **Server Entry**: `server/index.ts`
- **API Routes**: RESTful endpoints in `server/routes.ts`
- **Storage Layer**: Abstracted through `IStorage` interface with in-memory implementation
- **External Services**:Stable Diffusion 3.5 Large Model From Hugging Face for image generation, Phi-3-Mini-4K-Instruct from Hugging Face for text generation
- **Session Workflow**: Multi-stage process (prompt → describing → feedback → generating → completed)

### Frontend Architecture (React)
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom Y2K-inspired color scheme
- **State Management**: TanStack Query for server state, local React state for UI
- **Forms**: React Hook Form with Zod validation
- **Toast Notifications**: Custom toast system for user feedback

### API Structure
- `POST /api/sessions` - Create new image generation session
- `GET /api/sessions/:id` - Retrieve session details
- `PATCH /api/sessions/:id` - Update session data
- `POST /api/sessions/:id/generate-description` - Generate AI description from user prompt
- `POST /api/sessions/:id/refine-description` - Refine description based on user feedback
- `POST /api/sessions/:id/generate-image` - Generate final image

## Data Flow

### Image Generation Workflow
1. **User Input**: User provides initial prompt
2. **AI Enhancement**: Local AI generates detailed description from prompt (using smart fallback system)
3. **User Refinement**: User can provide feedback to improve description
4. **AI Refinement**: System refines description based on feedback, storing it as finalDescription
5. **User Approval**: User must approve the final description before image generation
6. **Image Generation**: Stable Diffusion 3.5 Large generates image using finalDescription or aiDescription
7. **Completion**: Session marked as completed with metrics (energy/time saved)

### Final Aesthetic Changes 
- **MAJOR FAIRYCORE TRANSFORMATION**: Complete visual and interaction redesign
- **Aesthetic Overhaul**: Transformed from Y2K cyber aesthetic to fairycore (whimsical, ethereal, delicate)
- **Color Palette**: Soft pastels - lavender, dusty rose, mint, buttercream, baby blue
- **Typography**: Added Dancing Script, Cardo, and Gloock fonts for magical feel
- **UI Elements**: Glass-fairy effects, floating animations, sparkle cursors, moonbeam glows
- **Magical Language**: All interactions now use fairycore language ("whisper your wishes", "send to the forest")
- **Energy Awareness**: Added "Magical Energy Units" system (forest light drops, stardust particles)
- **Floating Fairy Guide**: Ethereal assistant that provides contextual magical feedback
- **Moonbeam Missions**: Gamified sustainability tasks with honor-based completion system
- **Floating Background Elements**: Animated fairy creatures (🧚, 🦋, 🌸, 🍄, ✨, 🌙, ⭐, 🌿)
- **Magical Progress Visualization**: "Connecting to Enchanted Compute Grove" with simulated magical journey
- **Fairycore AI Descriptions**: Enhanced prompt engineering for ethereal, nature-magic themed outputs
- **Enhanced Negative Prompts**: Filters out harsh/dark elements to maintain soft fairycore aesthetic
- **Energy Conservation Stats**: Reframed as "Forest Light Saved" and magical impact metrics
- **Database Schema**: Added moonbeams tracking and magical energy usage fields
- **Final Branding**: Renamed to "Enchanted Diffusion" with green-pink gradient coloring
- **Updated Tagline**: "Where human dreams dance with AI magic to create enchanted images"

### State Management
- **Server State**: Managed by TanStack Query with automatic caching and synchronization
- **API Communication**: Custom `apiRequest` helper with error handling
- **Form State**: React Hook Form for complex form interactions
- **UI State**: Local React state for component-specific interactions

## External Dependencies

### Core Technologies
- **React 18**: Latest React with concurrent features
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type safety across the entire application
- **Vite**: Modern build tool and development server

### Database & ORM
- **Drizzle ORM**: Type-safe SQL toolkit
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store

### UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

### External Services
- *Microsoft Phi**: AI description generation and refinement
- **TanStack Query**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild compiles TypeScript server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **Development**: `NODE_ENV=development` with Vite dev server
- **Production**: `NODE_ENV=production` with static file serving
- **Database**: `DATABASE_URL` required for PostgreSQL connection
- **AI Services**: `HUGGINGFAKE KEY` required for models' integration

### Runtime Considerations
- **Static Files**: Express serves built frontend from `dist/public`
- **API Logging**: Custom middleware logs API requests with timing and response data
- **Error Handling**: Global error handler with appropriate HTTP status codes
- **Session Management**: PostgreSQL-backed sessions for user state persistence

### Replit Integration
- **Development Banner**: Automatic development mode detection
- **Runtime Error Overlay**: Enhanced error reporting in development
- **Cartographer Plugin**: Code mapping for debugging (development only)

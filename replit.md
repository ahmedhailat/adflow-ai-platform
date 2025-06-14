# AI Marketing Platform - AdFlow AI

## Overview
An AI-powered marketing automation platform that generates advertisements using OpenAI and manages campaigns across multiple social media channels. The platform features Arabic/English language support, subscription-based pricing with Stripe integration, and comprehensive campaign management tools.

## Recent Changes (January 15, 2025)
- **Database Migration**: Successfully migrated from in-memory storage to PostgreSQL database
- **Language Support**: Added Arabic/English toggle with complete UI translations
- **Payment Integration**: Implemented Stripe payment processing for subscriptions and campaign-based pricing
- **Database Schema**: Created complete schema with campaigns, ads, social_accounts, and posts tables
- **Data Seeding**: Added sample social media accounts and campaigns to demonstrate functionality

## Project Architecture

### Database Layer
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL via `@neondatabase/serverless`
- **Schema**: Defined in `shared/schema.ts` with TypeScript types
- **Storage**: `DatabaseStorage` class implementing `IStorage` interface

### Backend (Express.js)
- **API Routes**: RESTful endpoints for campaigns, ads, social accounts, posts
- **AI Integration**: OpenAI GPT-4o for ad copy generation
- **Payment Processing**: Stripe integration for subscriptions and one-time payments
- **Database Operations**: Full CRUD operations through Drizzle ORM

### Frontend (React + Vite)
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Language Context**: React Context for Arabic/English translations
- **Forms**: React Hook Form with Zod validation

### Key Features
1. **AI Ad Generation**: OpenAI-powered headline, text, and CTA generation
2. **Multi-platform Support**: Facebook, Instagram, LinkedIn, Twitter integration
3. **Campaign Management**: Complete lifecycle from creation to analytics
4. **Subscription Plans**: Free, Pro, and Enterprise tiers with Stripe billing
5. **Content Scheduling**: Calendar-based post scheduling
6. **Analytics Dashboard**: Performance metrics and reporting
7. **Bilingual Support**: Arabic and English with RTL layout support

## User Preferences
- **Communication Style**: Clear, professional responses without excessive technical jargon
- **Code Organization**: Prefer consolidated components over multiple small files
- **Database Approach**: Use persistent PostgreSQL database for production-ready data storage
- **Payment Processing**: Stripe integration for secure, professional payment handling
- **Language Support**: Complete Arabic translation with proper RTL layout

## Technical Decisions
- **Database Choice**: PostgreSQL for scalability and ACID compliance
- **ORM**: Drizzle for type-safe database operations
- **Payment Gateway**: Stripe for industry-standard payment processing
- **AI Provider**: OpenAI for reliable, high-quality content generation
- **Frontend Framework**: React with modern hooks and context patterns
- **Styling**: Tailwind CSS with Shadcn/ui component library

## Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `STRIPE_SECRET_KEY`: Stripe secret key for backend
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key for frontend

## Current Status
✅ Database fully migrated and operational
✅ Arabic/English language toggle working
✅ Stripe payment integration complete
✅ Sample data seeded for testing
✅ All core features functional
## How to Run

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Step-by-Step Instructions

1. **Clone and install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env file with your API URL
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Run tests**

   ```bash
   # Run tests in watch mode
   pnpm test

   # Run tests once
   pnpm test:run

   # Run tests with UI
   pnpm test:ui
   ```

5. **Build for production**

   ```bash
   pnpm build
   ```

6. **Lint code**
   ```bash
   pnpm lint
   ```

## Approach

This solution implements a modern React application with a focus on:

- Type Safety
- State Management
- API Integration
- Testing
- Code Quality

### Architecture

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers and reducers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and validations
├── services/       # API service layer
├── types/          # TypeScript type definitions
└── test/           # Test setup and utilities
```

## Features Implemented

✅ **User Management**

- Create new users with name and ZIP code
- List all users with location data
- Update existing users
- Delete users
- Select/view user details

✅ **Form Validation**

- Name validation (2-100 characters, letters only)
- ZIP code validation (12345 or 12345-6789 format)
- Zod schemas for type-safe validation

✅ **State Management**

- Centralized user state with Context API
- Loading states and error handling
- Optimistic updates for better UX

✅ **API Integration**

- RESTful API service layer
- Request/response interceptors
- Proper error handling and timeouts

✅ **Testing Suite**

- 33 comprehensive unit tests
- Validation testing
- API service mocking
- Hook testing with React Testing Library
- Context/reducer testing

## Assumptions Made

1. **API Structure**: Assumed RESTful API with standard CRUD endpoints (`/users`)
2. **Error Handling**: API returns structured error responses with message field

## Testing

### Testing Strategy

- **Unit Tests**: All business logic and utilities
- **Integration Tests**: API service with mock adapter
- **React Testing**: Hooks and context with React Testing Library
- **Mock Strategy**: API calls mocked for predictable testing

### Test Tools

- **Vitest**: Fast test runner with TypeScript support
- **React Testing Library**: Component and hook testing
- **Axios Mock Adapter**: API request mocking
- **Jest DOM**: Enhanced DOM testing matchers

### Running Tests

```bash
# Watch mode (recommended for development)
pnpm test

# Single run (CI/CD)
pnpm test:run

# UI mode (visual test runner)
pnpm test:ui
```

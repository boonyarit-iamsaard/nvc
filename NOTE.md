# NOTE

## Recommended Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes
│   ├── (public)/          # Public routes
│   ├── api/               # API routes (if needed)
│   └── layout.tsx         # Root layout
│
├── core/                   # Core business logic & infrastructure
│   ├── auth/              # Authentication core logic
│   │   ├── guards/        # Auth guards/middlewares
│   │   └── providers/     # Auth providers
│   ├── configs/           # Configuration files
│   │   ├── auth.config.ts
│   │   ├── email.config.ts
│   │   └── app.config.ts
│   ├── database/          # Database layer
│   │   ├── migrations/    # Prisma migrations
│   │   ├── seeds/        # Seed data
│   │   ├── types/        # Generated types
│   │   └── schema.prisma # Schema definition
│   ├── helpers/          # Core business helpers
│   │   ├── auth.helper.ts     # Auth-related helpers
│   │   ├── validation.ts      # Core validation logic
│   │   └── permissions.ts     # Permission checking
│   ├── server/           # Server-side infrastructure
│   │   ├── routers/      # Root tRPC router composition
│   │   ├── middlewares/  # tRPC middlewares
│   │   └── context/      # tRPC context
│   ├── trpc/             # tRPC setup
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── shared.ts
│   └── types/            # Core business types
│       ├── auth.types.ts      # Auth-related types
│       ├── models.types.ts    # Shared model types
│       └── api.types.ts       # API-related types
│
├── features/             # Feature modules
│   ├── bookings/        # Example feature module
│   │   ├── components/  # Feature-specific components
│   │   ├── hooks/      # Feature-specific hooks
│   │   ├── helpers/    # Feature-specific helpers
│   │   ├── schemas/    # Zod schemas (types inferred from these)
│   │   │   ├── create-booking.schema.ts  # Create booking schema & types
│   │   │   ├── update-booking.schema.ts  # Update booking schema & types
│   │   │   └── index.ts                  # Export all schemas & inferred types
│   │   └── trpc/       # tRPC procedures & business logic
│   │       ├── booking.repository.ts  # Data access layer
│   │       ├── booking.service.ts     # Business logic layer
│   │       └── router.ts             # tRPC procedure definitions
│   ├── emails/
│   ├── memberships/
│   ├── room-types/
│   └── users/
│
└── common/              # Shared utilities & components
    ├── components/     # Shared UI components
    │   ├── ui/        # Basic UI components
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   └── Card.tsx
    │   └── forms/     # Form components
    │       ├── FormField.tsx
    │       └── FormSelect.tsx
    ├── helpers/       # General helpers
    │   ├── date.helper.ts    # Date formatting
    │   ├── string.helper.ts  # String manipulation
    │   └── array.helper.ts   # Array helpers
    ├── hooks/         # Shared hooks
    │   ├── useDebounce.ts
    │   ├── useLocalStorage.ts
    │   └── useMediaQuery.ts
    └── types/         # Common TypeScript types
        ├── ui.types.ts       # UI-related types
        └── helpers.types.ts  # Helper types
```

## Previous Notes

## Directory Structure

```bash
src/
├── server/
│   ├── api/
│   │   └── trpc.ts
│   ├── modules/ # Domain-driven modules
│   │   └── room-type/
│   │       ├── dto/ # Data Transfer Objects
│   │       ├── entities/ # Domain entities
│   │       ├── errors/ # Module specific errors
│   │       ├── repositories/
│   │       ├── service.ts
│   │       ├── router.ts
│   │       └── schema.ts
│   ├── shared/
│   │   ├── errors/
│   │   └── helpers/
│   └── config/
└── types/
```

## Error Handling Pattern

```typescript
// server/shared/errors/base.error.ts
export class BaseError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// server/modules/room-type/errors/room-type.error.ts
export class RoomTypeNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Room type ${id} not found`, 'ROOM_TYPE_NOT_FOUND');
  }
}
```

## Testing Structure

```bash
modules/
└── room-type/
    └── __tests__/
        ├── service.test.ts
        ├── router.test.ts
        └── repository.test.ts
```

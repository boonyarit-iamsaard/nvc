# NOTE

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
│   │   └── utils/
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

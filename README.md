# Pokretanje (Docker compose)

```bash
docker compose up --build -d
docker compose exec nextjs npx drizzle-kit migrate
docker compose exec nextjs npm run db:seed
```

## Zaustavljanje

```bash
docker compose down -v
```

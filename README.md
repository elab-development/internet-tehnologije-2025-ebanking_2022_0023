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

## Pokretanje testova

```bash
npm test
```

### Napomena za testove
Testovi su deo CI/CD-a. Automatski deploy se pokrece pozivom komande ```git push``` na *main* grani. 
Testovi su implementirani za sledece funkcionalnosti: 
1. Autentifikacija i sigurnost (auth, jwt)
2. Upravljanje racunima
3. Upravljanje transakcijama
4. API Endpointi (transakcije)
   
Ukupno testova: 51

### Pristup softveru - Vercel
```bach
https://internet-tehnologije-2025-ebanking.vercel.app/login
```

### Baza podataka - Neon

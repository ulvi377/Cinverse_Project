# Netflix API

## Tələblər
- .NET 10 SDK

## İşə salmaq
```powershell
cd CineVerse.API
dotnet restore
dotnet run --urls http://0.0.0.0:5030
```

İlk işə düşəndə `cineverse.db` yaradılır və nümunə filmlər əlavə olunur.

## Əsas endpointlər
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/movies?page=1&pageSize=10`
- GET `/api/movies?search=interstellar`
- GET `/api/movies?genre=Sci-Fi&minRating=8`
- GET `/api/movies/{id}`
- GET `/api/movies/genres`
- GET `/api/reviews/movie/{movieId}`
- POST `/api/reviews` (Bearer token)
- PUT `/api/reviews/{id}` (Bearer token)
- DELETE `/api/reviews/{id}` (Bearer token)
- GET/POST `/api/watchlist` (Bearer token)
- PATCH `/api/watchlist/{id}` (Bearer token)
- DELETE `/api/watchlist/{id}` (Bearer token)

JWT key development üçündür. Real yayımdan əvvəl dəyişdirilməlidir.

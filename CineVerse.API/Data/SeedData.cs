using CineVerse.API.Models;

namespace CineVerse.API.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        if (db.Movies.Any()) return;

        db.Movies.AddRange(
            new Movie { Title = "Interstellar", Overview = "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.", Genre = "Sci-Fi", ImdbRating = 8.7, ReleaseYear = 2014, Cast = "Matthew McConaughey, Anne Hathaway, Jessica Chastain", PosterUrl = "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VHsX2y.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=Interstellar+trailer" },
            new Movie { Title = "The Dark Knight", Overview = "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.", Genre = "Action", ImdbRating = 9.0, ReleaseYear = 2008, Cast = "Christian Bale, Heath Ledger, Aaron Eckhart", PosterUrl = "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIshv0c4V0e.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=The+Dark+Knight+trailer" },
            new Movie { Title = "Inception", Overview = "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.", Genre = "Sci-Fi", ImdbRating = 8.8, ReleaseYear = 2010, Cast = "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page", PosterUrl = "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/s3TBrRgb2g7t5m2x4t4c7p5x8.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=Inception+trailer" },
            new Movie { Title = "The Shawshank Redemption", Overview = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", Genre = "Drama", ImdbRating = 9.3, ReleaseYear = 1994, Cast = "Tim Robbins, Morgan Freeman", PosterUrl = "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=Shawshank+Redemption+trailer" },
            new Movie { Title = "Spider-Man: Across the Spider-Verse", Overview = "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.", Genre = "Animation", ImdbRating = 8.6, ReleaseYear = 2023, Cast = "Shameik Moore, Hailee Steinfeld, Oscar Isaac", PosterUrl = "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5XjtoH2S.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=Across+the+Spider-Verse+trailer" },
            new Movie { Title = "The Godfather", Overview = "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.", Genre = "Crime", ImdbRating = 9.2, ReleaseYear = 1972, Cast = "Marlon Brando, Al Pacino, James Caan", PosterUrl = "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", BackdropUrl = "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", TrailerUrl = "https://www.youtube.com/results?search_query=The+Godfather+trailer" }
        );
        db.SaveChanges();
    }
}

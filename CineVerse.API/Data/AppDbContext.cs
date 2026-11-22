using CineVerse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<WatchlistItem> Watchlist => Set<WatchlistItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<WatchlistItem>().HasIndex(x => new { x.UserId, x.MovieId }).IsUnique();
        modelBuilder.Entity<Review>().HasIndex(x => new { x.UserId, x.MovieId }).IsUnique();
    }
}

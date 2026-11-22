namespace CineVerse.API.Models;

public class WatchlistItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MovieId { get; set; }
    public string Status { get; set; } = "PlanToWatch";
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public Movie? Movie { get; set; }
}

namespace CineVerse.API.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Overview { get; set; } = "";
    public string PosterUrl { get; set; } = "";
    public string BackdropUrl { get; set; } = "";
    public string Genre { get; set; } = "";
    public string Cast { get; set; } = "";
    public string TrailerUrl { get; set; } = "";
    public double ImdbRating { get; set; }
    public int ReleaseYear { get; set; }
}

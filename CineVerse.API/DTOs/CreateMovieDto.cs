using System.ComponentModel.DataAnnotations;

namespace CineVerse.API.DTOs;

public class CreateMovieDto
{
    [Required, MaxLength(160)] public string Title { get; set; } = "";
    [Required, MaxLength(3000)] public string Overview { get; set; } = "";
    [Required, Url, MaxLength(1000)] public string PosterUrl { get; set; } = "";
    [MaxLength(1000)] public string BackdropUrl { get; set; } = "";
    [Required, MaxLength(100)] public string Genre { get; set; } = "";
    [MaxLength(1000)] public string Cast { get; set; } = "";
    [Required, Url, MaxLength(1000)] public string TrailerUrl { get; set; } = "";
    [Range(0, 10)] public double ImdbRating { get; set; } = 0;
    [Range(1888, 2100)] public int ReleaseYear { get; set; }
}

namespace CineVerse.API.DTOs;

public record ReviewRequest(int MovieId, int Rating, string Comment);

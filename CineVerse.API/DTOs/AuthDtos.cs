namespace CineVerse.API.DTOs;

public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);
public record AuthResponse(string Token, int UserId, string Name, string Email);

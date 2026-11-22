using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CineVerse.API.Data;
using CineVerse.API.DTOs;
using CineVerse.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CineVerse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, IConfiguration config) : ControllerBase
{
    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name) || !dto.Email.Contains('@') || dto.Password.Length < 6)
            return BadRequest(new { message = "Ad, düzgün email və minimum 6 simvolluq şifrə daxil edin." });
        var email = dto.Email.Trim().ToLower();
        if (db.Users.Any(x => x.Email == email)) return Conflict(new { message = "Bu email artıq qeydiyyatdan keçib." });

        var user = new User { Name = dto.Name.Trim(), Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password) };
        db.Users.Add(user);
        db.SaveChanges();
        return Ok(CreateToken(user));
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = db.Users.FirstOrDefault(x => x.Email == dto.Email.Trim().ToLower());
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email və ya şifrə yanlışdır." });
        return Ok(CreateToken(user));
    }

    private AuthResponse CreateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Name, user.Name), new Claim(ClaimTypes.Email, user.Email) };
        var token = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7), signingCredentials: credentials);
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.Id, user.Name, user.Email);
    }
}

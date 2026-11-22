using System.Security.Claims;
using CineVerse.API.Data;
using CineVerse.API.DTOs;
using CineVerse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? genre, [FromQuery] double? minRating, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 30);
        var query = db.Movies.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(x => x.Title.Contains(search) || x.Overview.Contains(search));
        if (!string.IsNullOrWhiteSpace(genre) && genre != "All") query = query.Where(x => x.Genre == genre);
        if (minRating.HasValue) query = query.Where(x => x.ImdbRating >= minRating.Value);
        var total = await query.CountAsync();
        var movies = await query.OrderByDescending(x => x.ImdbRating).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new { page, pageSize, total, movies });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var movie = await db.Movies.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return movie == null ? NotFound() : Ok(movie);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateMovieDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var movie = new Movie
        {
            Title = dto.Title.Trim(),
            Overview = dto.Overview.Trim(),
            PosterUrl = dto.PosterUrl.Trim(),
            BackdropUrl = string.IsNullOrWhiteSpace(dto.BackdropUrl) ? dto.PosterUrl.Trim() : dto.BackdropUrl.Trim(),
            Genre = dto.Genre.Trim(),
            Cast = dto.Cast.Trim(),
            TrailerUrl = dto.TrailerUrl.Trim(),
            ImdbRating = dto.ImdbRating,
            ReleaseYear = dto.ReleaseYear
        };

        db.Movies.Add(movie);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie);
    }


    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreateMovieDto dto)
    {
        var movie = await db.Movies.FirstOrDefaultAsync(x => x.Id == id);
        if (movie == null) return NotFound();
        movie.Title = dto.Title.Trim();
        movie.Overview = dto.Overview.Trim();
        movie.PosterUrl = dto.PosterUrl.Trim();
        movie.BackdropUrl = string.IsNullOrWhiteSpace(dto.BackdropUrl) ? dto.PosterUrl.Trim() : dto.BackdropUrl.Trim();
        movie.Genre = dto.Genre.Trim();
        movie.Cast = dto.Cast.Trim();
        movie.TrailerUrl = dto.TrailerUrl.Trim();
        movie.ImdbRating = dto.ImdbRating;
        movie.ReleaseYear = dto.ReleaseYear;
        await db.SaveChangesAsync();
        return Ok(movie);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var movie = await db.Movies.FirstOrDefaultAsync(x => x.Id == id);
        if (movie == null) return NotFound();
        db.Movies.Remove(movie);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("genres")]
    public async Task<IActionResult> GetGenres() =>
        Ok(await db.Movies.Select(x => x.Genre).Distinct().OrderBy(x => x).ToListAsync());
}

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
public class ReviewsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("movie/{movieId:int}")]
    public async Task<IActionResult> GetForMovie(int movieId)
    {
        var reviews = await db.Reviews.Include(x => x.User).Where(x => x.MovieId == movieId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new { x.Id, x.MovieId, x.Rating, x.Comment, x.CreatedAt, UserName = x.User!.Name })
            .ToListAsync();
        return Ok(reviews);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(ReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5 || string.IsNullOrWhiteSpace(request.Comment))
            return BadRequest(new { message = "1-5 ulduz və rəy mətni daxil edin." });
        if (!await db.Movies.AnyAsync(x => x.Id == request.MovieId)) return NotFound();
        var review = await db.Reviews.FirstOrDefaultAsync(x => x.UserId == UserId && x.MovieId == request.MovieId);
        if (review == null)
        {
            review = new Review { UserId = UserId, MovieId = request.MovieId };
            db.Reviews.Add(review);
        }
        review.Rating = request.Rating;
        review.Comment = request.Comment.Trim();
        review.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok(review);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ReviewRequest request)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (review == null) return NotFound();
        if (request.Rating < 1 || request.Rating > 5 || string.IsNullOrWhiteSpace(request.Comment)) return BadRequest();
        review.Rating = request.Rating;
        review.Comment = request.Comment.Trim();
        review.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok(review);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (review == null) return NotFound();
        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

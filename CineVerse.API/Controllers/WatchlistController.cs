using System.Security.Claims;
using CineVerse.API.Data;
using CineVerse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CineVerse.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class WatchlistController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> Get() =>
        Ok(await db.Watchlist.Include(x => x.Movie).Where(x => x.UserId == UserId).OrderByDescending(x => x.AddedAt).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddWatchlistRequest request)
    {
        if (!await db.Movies.AnyAsync(x => x.Id == request.MovieId)) return NotFound(new { message = "Film tapılmadı." });
        var item = await db.Watchlist.FirstOrDefaultAsync(x => x.UserId == UserId && x.MovieId == request.MovieId);
        if (item != null) return Ok(item);
        item = new WatchlistItem { UserId = UserId, MovieId = request.MovieId, Status = "PlanToWatch" };
        db.Watchlist.Add(item);
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var item = await db.Watchlist.FirstOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (item == null) return NotFound();
        if (request.Status is not ("PlanToWatch" or "Watched")) return BadRequest(new { message = "Status PlanToWatch və ya Watched olmalıdır." });
        item.Status = request.Status;
        await db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await db.Watchlist.FirstOrDefaultAsync(x => x.Id == id && x.UserId == UserId);
        if (item == null) return NotFound();
        db.Watchlist.Remove(item);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record AddWatchlistRequest(int MovieId);
public record UpdateStatusRequest(string Status);

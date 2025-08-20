using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StockWise.Data;
using StockWise.Models;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.Formatters;
using SQLitePCL;
using StockWise.DTOs.Portfolio;

namespace StockWise.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PortfolioController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PortfolioController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserName() => User.FindFirstValue(ClaimTypes.Name) ?? "";


    [HttpPost]
    public async Task<IActionResult> CreatePortfolio( CreatePortfolioDTO dto)
    {
        var username = GetUserName();
        if (string.IsNullOrEmpty(username))
            return Unauthorized(new {mesage = "Invalid token"});
        
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
        if(user == null)
            return Unauthorized(new {mesage = "User not found"});

        var portfolio = new Portfolio
        {
            Name = dto.Name,
            UserId = user.Id
        };
        _context.Portfolios.Add(portfolio);
        await _context.SaveChangesAsync();
        
        var result = new PortfolioDTO {Id = portfolio.Id, Name = dto.Name};
        
        return CreatedAtAction(nameof(GetById), new { id = portfolio.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyPortfolios()
    {
        var username = GetUserName();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized(new {mesage = "Invalid token"});
        }
        
        var portfolios = await _context.Portfolios
            .Where(p=>p.User.UserName == username)
            .OrderBy(p => p.Id)
            .Select(p => new PortfolioDTO {Id = p.Id, Name = p.Name})
            .ToListAsync();
        
        return Ok(portfolios);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var username = GetUserName();
        
        if(string.IsNullOrEmpty(username))
            return Unauthorized(new {mesage = "Invalid token"});
        
        var dto = _context.Portfolios
            .Where(p => p.Id == id && p.User.UserName == username)
            .Select(p => new PortfolioDTO {Id = p.Id, Name = p.Name})
            .FirstOrDefault();
        
        if(dto == null)
            return NotFound(new {mesage = "Portfolio not found for this user", id});
        
        return Ok(dto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePortfolio(int id, CreatePortfolioDTO dto)
    {
        var username = GetUserName();
        if (string.IsNullOrEmpty(username))
            return Unauthorized(new { message = "Invalid token." });
        
        var portfolio = await _context.Portfolios
            .FirstOrDefaultAsync(p=> p.Id == id && p.User.UserName == username);
        if(portfolio == null)
            return NotFound(new {mesage = "Portfolio not found for this user", id});
        
        portfolio.Name = dto.Name;
        await _context.SaveChangesAsync();

        return Ok(new PortfolioDTO { Id = portfolio.Id, Name = dto.Name });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePortfolio(int id)
    {
        var username = GetUserName();
        if(string.IsNullOrEmpty(username))
            return Unauthorized(new {mesage = "Invalid token." });
        
        var portfolio = await _context.Portfolios
            .FirstOrDefaultAsync(p=> p.Id == id && p.User.UserName == username);
        if(portfolio == null)
            return NotFound(new {mesage = "Portfolio not found for this user", id});
        
        _context.Portfolios.Remove(portfolio);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Deleted", id });
    }
}
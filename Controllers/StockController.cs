using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using StockWise.Data;
using StockWise.DTOs.Stock;
using StockWise.Models;
using System.Security.Claims;

namespace StockWise.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StockController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StockController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    private string GetUserName() => User.FindFirstValue(ClaimTypes.Name) ?? "";

    [HttpPost]
    public async Task<ActionResult<Stock>> CreateStock(CreateStockDTO dto)
    {
        var username = GetUserName();
        
        var portfolio = await _context.Portfolios
            .Include(p=>p.User)
            .FirstOrDefaultAsync(p=>p.Id == dto.PortfolioId && p.User.UserName == username);
        if(portfolio == null)
            return NotFound(new {message = "Portfolio not found for this user", dto.PortfolioId});

        var stock = new Stock
        {
            Symbol = dto.Symbol,
            Quantity = dto.Quantity,
            BuyPrice = dto.BuyPrice,
            PortfolioId = portfolio.Id,
        };
        
        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        return Ok(new StockDTO
        {
            Id = stock.Id,
            Symbol = stock.Symbol,
            Quantity = stock.Quantity,
            BuyPrice = stock.BuyPrice,
        });
    }

    [HttpGet("portfolio/{portfolioId:int}")]
    public async Task<ActionResult<Portfolio>> GetStocksByPortfolio(int portfolioId)
    {
        var username = GetUserName();
        var portfolio = await _context.Portfolios
            .Include(p=>p.User)
            .FirstOrDefaultAsync(p=>p.Id == portfolioId && p.User.UserName == username);
        if(portfolio == null)
            return NotFound(new {message = "Portfolio not found for this user", portfolioId});
        
        var stocks = await _context.Stocks
            .Where(s=>s.PortfolioId == portfolio.Id)
            .Select(s=> new StockDTO
            {
                Id = s.Id,
                Symbol = s.Symbol,
                Quantity = s.Quantity,
                BuyPrice = s.BuyPrice,
            })
            .ToListAsync();
        
        return Ok(stocks);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Stock>> UpdateStock(int id, UpdateStockDTO dto)
    {
        var username = GetUserName();
        
        var stock = await _context.Stocks
            .Include(s => s.Portfolio)
            .ThenInclude(p=>p.User)
            .FirstOrDefaultAsync(s=>s.Id == id && s.Portfolio.User.UserName == username);
        if(stock == null)
            return NotFound(new {message = "Stock not found for this user", id});
        
        stock.Symbol = dto.Symbol;
        stock.Quantity = dto.Quantity;
        stock.BuyPrice = dto.BuyPrice;
        
        await _context.SaveChangesAsync();

        return Ok(new StockDTO
        {
            Id = stock.Id,
            Symbol = stock.Symbol,
            Quantity = stock.Quantity,
            BuyPrice = stock.BuyPrice,
        });
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<Stock>> DeleteStock(int id)
    {
        var username = GetUserName();
        
        var stock = await _context.Stocks
            .Include(s => s.Portfolio)
            .ThenInclude(p=>p.User)
            .FirstOrDefaultAsync(s=>s.Id == id && s.Portfolio.User.UserName == username);

        if (stock == null)
        {
            return NotFound(new {message = "Stock not found for this user", id});
        }
        
        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();
        
        return Ok(new {message = "Stock deleted successfully", id});
    }
}
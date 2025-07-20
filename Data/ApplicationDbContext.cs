using Microsoft.EntityFrameworkCore;
using StockWise.Models;

namespace StockWise.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
    
    public DbSet<User> Users => Set<User>();
    public DbSet<Portfolio> Portfolios => Set<Portfolio>();
    public DbSet<Stock> Stocks => Set<Stock>();
}
namespace StockWise.Models;

public class Portfolio
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public int UserId { get; set; }
    public User User { get; set; }

    public List<Stock> Stocks { get; set; } = new();
}
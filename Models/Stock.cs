namespace StockWise.Models;

public class Stock
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public double Quantity { get; set; } 
    public double BuyPrice { get; set; }
    
    public int PortfolioId { get; set; }
    public Portfolio? Portfolio { get; set; } 
 
}
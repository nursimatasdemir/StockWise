namespace StockWise.DTOs.Stock;

public class CreateStockDTO
{
    public string Symbol { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public double BuyPrice { get; set; }
    public int PortfolioId { get; set; }
}
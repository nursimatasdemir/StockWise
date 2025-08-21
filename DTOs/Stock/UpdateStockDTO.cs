namespace StockWise.DTOs.Stock;

public class UpdateStockDTO
{
    public string Symbol { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public double BuyPrice { get; set; }
}
namespace StockWise.DTOs.Stock;

public class StockDetailDTO
{
    public string Symbol { get; set; }
    public int Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue { get; set; }
}
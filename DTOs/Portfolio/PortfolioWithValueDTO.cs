namespace StockWise.DTOs.Portfolio;

public class PortfolioWithValueDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double TotalValue { get; set; }
    public List<StockValueDTO> Stocks { get; set; } = new();
}

public class StockValueDTO
{
    public int Id { get; set; }
    public string Symbol { get; set; } = String.Empty;
    public double Quantity { get; set; }
    public double BuyPrice { get; set; }
    public double CurrentPrice { get; set; }
    public double Value => Quantity * CurrentPrice;
}
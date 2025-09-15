using StockWise.DTOs.Stock;

namespace StockWise.DTOs.Portfolio;

public class PortfolioDetailDTO
{
    public int PortfolioId { get; set; }
    public string PortfolioName { get; set; }
    public decimal TotalValue { get; set; }
    public List<StockDetailDTO> Stocks { get; set; }
}
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace StockWise.Services;

public class StockPriceService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public StockPriceService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<decimal?> GetCurrentPrice(string symbol)
    {
        var apiKey = _config["ALPHA:Key"];
        if(string.IsNullOrEmpty(apiKey))
            throw new InvalidOperationException("No ALPHA:Key configured.");
        
        var url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={apiKey}";
        
        var response = await _httpClient.GetStringAsync(url);
        using var doc = JsonDocument.Parse(response);

        if (doc.RootElement.TryGetProperty("Global Quote", out var globalQuote))
        {
            if (globalQuote.TryGetProperty("05. price", out var priceElement))
            {
                if (decimal.TryParse(priceElement.GetString(), out var price))
                {
                    return price;
                }
            }
        }
        
        return null;
    }
    
}
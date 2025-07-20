namespace StockWise.Models;

public class User
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string role { get; set; } = "User";
    public List<Portfolio> Portfolios { get; set; } = new();
}

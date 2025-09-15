using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockWise.Data;
using StockWise.DTOs.Auth;
using StockWise.Models;
using StockWise.Services;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Win32.SafeHandles;

namespace StockWise.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(ApplicationDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterDTO registerDto)
    {
        if (await _context.Users.AnyAsync(u => u.UserName == registerDto.Username))
            return BadRequest("Username is taken");
        
        var hashed = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        var user = new User
        {
            UserName = registerDto.Username,
            PasswordHash = hashed,
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        return Ok("User registration successfully");
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginDTO loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid credentials");
        }
        
        var token = _tokenService.CreateToken(user);
        
        return Ok(new {token});
    }
    
    [HttpOptions("login")]
    public IActionResult HandleOptions()
    {
        // The CORS middleware will handle the necessary headers.
        // We just need to ensure the routing system returns a successful response.
        return Ok();
    }

    [Authorize]
    [HttpGet("user")]
    public IActionResult GetUser()
    {
        return Ok(User.Identity?.Name);
    }
    
    
    
}
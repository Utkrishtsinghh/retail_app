using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var totalRevenue = await _context.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0m;
            var totalOrders = await _context.Orders.CountAsync();
            var lowStockProducts = await _context.Products.Where(p => p.Stock < 5).ToListAsync();
            var userCount = await _context.Users.CountAsync(u => u.Role == "User");

            return Ok(new
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                LowStockProducts = lowStockProducts,
                TotalUsers = userCount
            });
        }
    }
}

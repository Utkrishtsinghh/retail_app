using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() 
        {
            var claim = User.FindFirstValue("UserId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            return int.Parse(claim ?? "0");
        }

        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] OrderDto dto)
        {
            var userId = GetUserId();
            var cartItems = await _context.CartItems.Include(c => c.Product).Where(c => c.UserId == userId).ToListAsync();
            
            if (!cartItems.Any()) return BadRequest(new { message = "Cart is empty" });

            decimal total = cartItems.Sum(c => c.Quantity * c.Product!.Price);

            var order = new Order
            {
                UserId = userId,
                TotalAmount = total,
                DeliveryAddress = dto.DeliveryAddress,
                OrderItems = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    Price = c.Product!.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            
            // Deduct stock
            foreach (var item in cartItems)
            {
                item.Product!.Stock -= item.Quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            var userId = GetUserId();
            var orders = await _context.Orders.Include(o => o.OrderItems)!.ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId).OrderByDescending(o => o.CreatedAt).ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var userId = GetUserId();
            var order = await _context.Orders.Include(o => o.OrderItems)!.ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
            
            if (order == null) return NotFound();
            if (order.UserId != userId && !User.IsInRole("Admin")) return Forbid();

            return Ok(order);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            return Ok(await _context.Orders.Include(o => o.User).OrderByDescending(o => o.CreatedAt).ToListAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            
            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}

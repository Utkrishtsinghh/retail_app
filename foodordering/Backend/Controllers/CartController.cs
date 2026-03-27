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
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId() 
        {
            var claim = User.FindFirstValue("UserId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub);
            return int.Parse(claim ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = GetUserId();
            var items = await _context.CartItems.Include(c => c.Product).Where(c => c.UserId == userId).ToListAsync();
            return Ok(items);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartDto dto)
        {
            var userId = GetUserId();
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);
            
            if (item != null)
            {
                item.Quantity += dto.Quantity;
            }
            else
            {
                item = new CartItem { UserId = userId, ProductId = dto.ProductId, Quantity = dto.Quantity };
                _context.CartItems.Add(item);
            }
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateCart([FromBody] CartDto dto)
        {
            var userId = GetUserId();
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);
            if (item == null) return NotFound();
            
            item.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = GetUserId();
            var item = await _context.CartItems.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
            if (item == null) return NotFound();
            
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

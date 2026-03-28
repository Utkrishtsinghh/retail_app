using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
            
            var seedProducts = new List<Product>
            {
                new Product { Name = "Margherita Pizza", Description = "Classic cheese and tomato pizza", Price = 299m, Stock = 50 },
                new Product { Name = "Pepperoni Pizza", Description = "Pizza with pepperoni slices", Price = 349m, Stock = 40 },
                new Product { Name = "Veggie Delight Pizza", Description = "Capsicum, olives, onions, and sweet corn", Price = 329m, Stock = 60 },
                new Product { Name = "Paneer Tikka Pizza", Description = "Smoky paneer with spicy tikka sauce", Price = 369m, Stock = 45 },
                new Product { Name = "BBQ Chicken Pizza", Description = "Grilled chicken with BBQ glaze", Price = 389m, Stock = 45 },
                new Product { Name = "Farmhouse Pizza", Description = "Loaded with veggies and extra cheese", Price = 349m, Stock = 55 },
                new Product { Name = "Garlic Bread", Description = "Warm bread with garlic butter and herbs", Price = 149m, Stock = 100 },
                new Product { Name = "Cheesy Jalapeno Garlic Bread", Description = "Garlic bread topped with jalapenos and cheese", Price = 179m, Stock = 90 },
                new Product { Name = "Veg Loaded Fries", Description = "Crispy fries with cheesy sauce and veggies", Price = 159m, Stock = 120 },
                new Product { Name = "Tandoori Chicken Wings", Description = "Spicy tandoori marinated wings", Price = 249m, Stock = 70 },
                new Product { Name = "Caesar Salad", Description = "Fresh lettuce, croutons, parmesan, Caesar dressing", Price = 199m, Stock = 80 },
                new Product { Name = "Pasta Alfredo", Description = "Creamy white sauce pasta", Price = 279m, Stock = 75 },
                new Product { Name = "Chocolate Lava Cake", Description = "Warm cake with molten chocolate center", Price = 119m, Stock = 120 },
                new Product { Name = "Brownie", Description = "Fudgy chocolate brownie", Price = 99m, Stock = 150 },
                new Product { Name = "Cold Drink", Description = "Refreshing chilled cola", Price = 49m, Stock = 200 },
                new Product { Name = "Iced Tea", Description = "Cool lemon iced tea", Price = 69m, Stock = 180 },
                new Product { Name = "Lemonade", Description = "Fresh lemon drink", Price = 59m, Stock = 180 }
            };

            var existingNames = new HashSet<string>(context.Products.Select(p => p.Name));
            var toAdd = seedProducts.Where(p => !existingNames.Contains(p.Name)).ToList();
            if (toAdd.Any())
            {
                context.Products.AddRange(toAdd);
                context.SaveChanges();
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}

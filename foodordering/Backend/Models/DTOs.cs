namespace Backend.Models
{
    public class RegisterDto { public string Username { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
    public class LoginDto { public string Username { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
    public class CartDto { public int ProductId { get; set; } public int Quantity { get; set; } }
    public class OrderDto { public string DeliveryAddress { get; set; } = string.Empty; }
}

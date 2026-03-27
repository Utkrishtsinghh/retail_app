using System.Collections.Generic;

namespace Backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; 
        public string DeliveryAddress { get; set; } = string.Empty;
        public System.DateTime CreatedAt { get; set; } = System.DateTime.UtcNow;

        public User? User { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}

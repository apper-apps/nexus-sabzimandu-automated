// WhatsApp Business API Integration Service
class WhatsAppService {
  constructor() {
    // WhatsApp Business phone number (replace with actual business number)
    this.businessPhone = '+923001234567';
    this.baseUrl = 'https://wa.me';
  }

  // Generate WhatsApp URL with pre-filled message
  generateWhatsAppUrl(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    return `${this.baseUrl}/${phoneNumber}?text=${encodedMessage}`;
  }

  // Format product for WhatsApp catalog message
  formatProductForCatalog(product, selectedWeight = null, quantity = 1) {
    const weight = selectedWeight || product.weightOptions[0];
    const total = product.price * quantity;
    
    return `🛒 *${product.name}* (${product.nameUrdu})
💰 Price: Rs. ${product.price.toLocaleString()}/${product.unit}
📦 Weight: ${weight}
📊 Quantity: ${quantity}
💵 Total: Rs. ${total.toLocaleString()}
🏪 Vendor: ${product.vendorName}
${product.isOrganic ? '🌱 Organic Certified' : ''}
⭐ Rating: ${product.rating}/5

📱 Order this item directly through WhatsApp!`;
  }

  // Generate complete cart order message
  formatCartOrderMessage(cartItems, totalPrice, customerInfo = {}) {
    let message = `🛒 *NEW ORDER REQUEST*\n\n`;
    
    message += `👤 Customer: ${customerInfo.name || 'Customer'}\n`;
    message += `📱 Phone: ${customerInfo.phone || 'Not provided'}\n`;
    message += `📍 Address: ${customerInfo.address || 'Not provided'}\n\n`;
    
    message += `📋 *ORDER DETAILS:*\n`;
    message += `${'='.repeat(30)}\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.productName}*\n`;
      message += `   ${item.productNameUrdu}\n`;
      message += `   Weight: ${item.selectedWeight}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: Rs. ${item.price.toLocaleString()} each\n`;
      message += `   Subtotal: Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
      message += `   Vendor: ${item.vendorName}\n\n`;
    });
    
    message += `${'='.repeat(30)}\n`;
    message += `💰 *TOTAL: Rs. ${totalPrice.toLocaleString()}*\n\n`;
    
    message += `📞 Please confirm this order and provide delivery details.\n`;
    message += `🚚 Delivery charges will be calculated based on location.\n`;
    message += `💳 Payment: Cash on Delivery available\n\n`;
    
    message += `Thank you for choosing SabziMandi! 🌟`;
    
    return message;
  }

  // Generate product catalog overview message
  formatCatalogMessage(products) {
    let message = `🌟 *SABZIMANDI PRODUCT CATALOG*\n\n`;
    message += `🛒 Fresh Vegetables & Fruits Delivered Daily!\n`;
    message += `${'='.repeat(35)}\n\n`;
    
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    
    Object.keys(categories).forEach(category => {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      message += `📂 *${categoryName}*\n`;
      
      categories[category].slice(0, 5).forEach(product => {
        message += `• ${product.name} - Rs. ${product.price}/${product.unit}\n`;
      });
      
      if (categories[category].length > 5) {
        message += `  ... and ${categories[category].length - 5} more items\n`;
      }
      message += `\n`;
    });
    
    message += `📱 To order any item, simply send us the product name!\n`;
    message += `🚚 Free delivery on orders above Rs. 1000\n`;
    message += `💳 Cash on Delivery & Online Payment available\n\n`;
    message += `🌟 Thank you for choosing SabziMandi!`;
    
    return message;
  }

  // Open WhatsApp with product details
  openProductInWhatsApp(product, selectedWeight, quantity = 1) {
    const message = this.formatProductForCatalog(product, selectedWeight, quantity);
    const url = this.generateWhatsAppUrl(this.businessPhone, message);
    window.open(url, '_blank');
  }

  // Open WhatsApp with cart order
  openCartOrderInWhatsApp(cartItems, totalPrice, customerInfo = {}) {
    const message = this.formatCartOrderMessage(cartItems, totalPrice, customerInfo);
    const url = this.generateWhatsAppUrl(this.businessPhone, message);
    window.open(url, '_blank');
  }

  // Open WhatsApp with catalog
  openCatalogInWhatsApp(products) {
    const message = this.formatCatalogMessage(products);
    const url = this.generateWhatsAppUrl(this.businessPhone, message);
    window.open(url, '_blank');
  }

  // Get business WhatsApp URL for general contact
  getBusinessWhatsAppUrl(customMessage = '') {
    const defaultMessage = `Hello! I'm interested in your fresh produce. Please share your catalog.`;
    const message = customMessage || defaultMessage;
    return this.generateWhatsAppUrl(this.businessPhone, message);
  }
}

export const whatsappService = new WhatsAppService();
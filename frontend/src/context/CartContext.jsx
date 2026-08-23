import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const FREE_DELIVERY_THRESHOLD = 500;
const STANDARD_DELIVERY_FEE = 29;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('dmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dmart_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (product.stockQuantity <= 0) {
      toast.error(`Sorry, ${product.name} is currently out of stock.`);
      return;
    }

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items in stock.`);
          return prevItems;
        }
        toast.success(`Updated ${product.name} quantity to ${newQty}`);
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stockQuantity) {
          toast.error(`Only ${product.stockQuantity} items in stock.`);
          return prevItems;
        }
        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.product.id === productId) {
          if (newQuantity > item.product.stockQuantity) {
            toast.error(`Maximum available stock is ${item.product.stockQuantity}`);
            return { ...item, quantity: item.product.stockQuantity };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const target = prevItems.find((item) => item.product.id === productId);
      if (target) {
        toast.success(`Removed ${target.product.name} from cart`);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Computations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalMrp = items.reduce((sum, item) => {
    const mrp = Number(item.product.mrp) || Number(item.product.price);
    return sum + mrp * item.quantity;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const totalSavings = Math.max(0, totalMrp - subtotal);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = subtotal + deliveryFee;
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        totalItemsCount,
        totalMrp,
        subtotal,
        totalSavings,
        deliveryFee,
        finalTotal,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        freeDeliveryProgress,
        amountNeededForFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

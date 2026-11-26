"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export type CartItem = {
  id: string;
  menuItemId: string;
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    business: {
      id: string;
      name: string;
    };
  };
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  refreshCart: () => Promise<void>;
  addToCart: (menuItemId: string) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (menuItemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart");

      if (!response.ok) {
        if (response.status === 401) {
          setCart([]);
          return;
        }

        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();

      setCart(data.cart?.items ?? []);
    } catch (error) {
      console.error("FETCH CART ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (menuItemId: string) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to add item");
    }

    await refreshCart();
  };

  const updateQuantity = async (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(menuItemId);
      return;
    }

    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menuItemId, quantity }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to update cart");
    }

    await refreshCart();
  };

  const removeFromCart = async (menuItemId: string) => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menuItemId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Unable to remove item");
    }

    await refreshCart();
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.menuItem.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItems,
        totalPrice,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

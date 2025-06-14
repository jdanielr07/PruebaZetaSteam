'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

const initialState = [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART': {
      return action.payload;
    }
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.book_id === action.payload.book_id);
      if (existingItem) {
        return state.map(item =>
          item.book_id === action.payload.book_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'UPDATE_QUANTITY': {
      return state.map(item =>
        item.book_id === action.payload.book_id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }
    case 'REMOVE_ITEM': {
      return state.filter(item => item.book_id !== action.payload.book_id);
    }
    case 'CLEAR_CART': {
      return [];
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.token) {
        dispatch({ type: 'SET_CART', payload: [] });
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/cart', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) throw new Error('Error al obtener carrito');

        const data = await response.json();

        const items = data?.CartItems.map(item => ({
          book_id: item.book_id,
          quantity: item.quantity,
          book: item.Book,
        }));

        dispatch({ type: 'SET_CART', payload: items });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, [user]);

  const addItem = async (book) => {
    try {
      await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          book_id: book.id,
          quantity: 1,
        }),
      });

      dispatch({
        type: 'ADD_ITEM',
        payload: {
          book_id: book.id,
          quantity: 1,
          book,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (book_id, quantity) => {
    try {
      await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          book_id,
          quantity,
        }),
      });

      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { book_id, quantity },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (book_id) => {
    try {
      await fetch(`http://localhost:4000/api/cart/${book_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({
        type: 'REMOVE_ITEM',
        payload: { book_id },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:4000/api/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({ type: 'CLEAR_CART' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, dispatch, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
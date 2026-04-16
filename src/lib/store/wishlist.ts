import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  addedAt: Date
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        if (!get().items.find(i => i.id === item.id)) {
          set({ 
            items: [...get().items, { ...item, addedAt: new Date() }] 
          })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },
      
      isInWishlist: (id) => {
        return get().items.some(i => i.id === id)
      },
      
      clearWishlist: () => set({ items: [] })
    }),
    { name: 'eoutilles-wishlist' }
  )
)

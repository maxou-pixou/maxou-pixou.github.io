import { create } from "zustand";

const store = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  isNavCollapsed: false,
  setNavCollapsed: (isNavCollapsed) => set(() => ({ isNavCollapsed })),
}));

export default store;

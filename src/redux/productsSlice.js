import { createSlice } from "@reduxjs/toolkit";
import generateRandomId from "../utils/generateRandomId";

// Populated with 3 initial products
/**
 * Single source of truth for product data
 */
const productsSlice = createSlice({
  name: "products",
  initialState: [
    ...[1, 2, 3].map((_, index) => {
      const id = generateRandomId();
      return {
        id,
        name: `Product ${index + 1}`,
        description: `Description for product ${index + 1}`,
        rate: index + 1,
      };
    }),
  ],
  reducers: {
    addProduct: (state, action) => {
      state.push({ ...action.payload, id: generateRandomId() });
    },
    deleteProduct: (state, action) => {
      return state.filter((product) => product.id !== action.payload);
    },
    updateProduct: (state, action) => {
      /*  console.log(action.payload); */
      const index = state.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export const selectProductList = (state) => state.products;
export default productsSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_KEY = "YOUR_NY_TIMES_API_KEY";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books. Check your API key.");
      }

      const data = await response.json();

      return (data.results?.books || []).map((book) => ({
        title: book.title || "Unknown",
        author: book.author || "Unknown",
        publisher: book.publisher || "Unknown",
        description: book.description || ""
      }));
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    sortBy: "title",
    sortOrder: "asc",
    loading: false,
    error: null
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { setSortBy, setSortOrder } = booksSlice.actions;

export default booksSlice.reducer;

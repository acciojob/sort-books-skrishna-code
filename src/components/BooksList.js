
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  setSortBy,
  setSortOrder
} from "../features/books/booksSlice";

const BooksList = () => {
  const dispatch = useDispatch();

  const { books, sortBy, sortOrder, loading, error } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      const first = String(a[sortBy] || "").toLowerCase();
      const second = String(b[sortBy] || "").toLowerCase();

      const comparison = first.localeCompare(second);

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [books, sortBy, sortOrder]);

  return (
    <main className="container">
      <h1>Book Sorting App</h1>

      <div className="sorting-controls">
        <label htmlFor="sortBy">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => dispatch(setSortBy(event.target.value))}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="publisher">Publisher</option>
        </select>

        <label htmlFor="sortOrder">Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(event) => dispatch(setSortOrder(event.target.value))}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading && <p>Loading books...</p>}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>Description</th>
            </tr>
          </thead>

          <tbody>
            {sortedBooks.length > 0 ? (
              sortedBooks.map((book, index) => (
                <tr key={`${book.title}-${book.author}-${index}`}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No books available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default BooksList;

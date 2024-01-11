import React, { useEffect, useState } from "react";
import "./index.scss";
import { Collection } from "./components/Collection";

const categories = [
  { name: "Все" },
  { name: "Море" },
  { name: "Горы" },
  { name: "Архитектура" },
  { name: "Города" },
];

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [collections, setCollections] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(7); // <-- hardcoded

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const category = categoryId ? `category=${categoryId}` : "";

    fetch(
      `https://65a04647600f49256fafc9c7.mockapi.io/photo_collection?page=${currentPage}&limit=${limit}&${category}`
    )
      .then((response) => response.ok && response.json())
      .then((data) => setCollections(data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
    setTotalPages(Math.ceil(totalItems / limit));
  }, [categoryId, currentPage, limit]);

  function getPagination(totalPages) {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {categories.map((category, index) => (
            <li
              onClick={() => setCategoryId(index)}
              className={categoryId === index ? "active" : ""}
              key={category.name}
            >
              {category.name}
            </li>
          ))}
        </ul>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
          className="search-input"
          placeholder="Поиск по названию"
        />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Загрузка...</h2>
        ) : (
          collections
            .filter((collection) =>
              collection.name?.toLowerCase().includes(search?.toLowerCase())
            )
            .map((collection) => (
              <Collection
                key={collection.name}
                name={collection.name}
                images={collection.photos}
              />
            ))
        )}
      </div>
      <ul className="pagination">
        {getPagination(totalPages).map((page) => (
          <li
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

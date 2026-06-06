import { useState, useRef, useEffect } from "react";

import {
  getSuggestions,
  getTrendingSearches,
  searchPages,
} from "../services/SearchApi";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestion, setSuggestion] = useState([]);
  const [trending, setTrending] = useState([]);

  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await getTrendingSearches();

      setTrending(data.trendingResults);
    };

    fetchTrending();
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      return;
    }
    try {
      setLoading(true);
      setPage(1);
      setSuggestion([]);

      const data = await searchPages(searchInput, page);
      console.log(data);
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;

    setSearchInput(value);

    if (value.length < 2) {
      setSuggestion([]);
      return;
    }

    if (!value.trim()) {
      clearTimeout(debounceRef.current);

      setResult(null);
      setSuggestion([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const data = await getSuggestions(value);
      // console.log(data.suggestion);

      setSuggestion(data.suggestion);
    }, 300);
  };

  const nextPage = async () => {
    const newPage = page + 1;

    setPage(newPage);

    const data = await searchPages(searchInput, newPage);
    setResult(data);
  };

  const previousPage = async () => {
    const prevPage = page - 1;

    setPage(prevPage);

    const data = await searchPages(searchInput, prevPage);
    setResult(data);
  };

  return (
    <div className="flex flex-col bg-gray-800 text-white min-h-screen flex items-center">
      <h1 className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-900 self-center">
        Search Engine
      </h1>

      <div className="w-full flex flex-col items-center">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Search"
            className="w-full flex-1 text-xl py-3 px-6 bg-black outline-none"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="bg-black text-white bg-gray-600 rounded-full p-2 absolute right-4 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
          >
            <Search className="size-5" />
          </button>
        </div>
        {suggestion?.map((suggestion) => (
          <div
            key={suggestion}
            onClick={() => setSearchInput(suggestion)}
            className="w-full max-w-4xl bg-black flex px-4"
          >
            <p className="bg-black w-full my-1 opacity-70">{suggestion}</p>
            <X />
          </div>
        ))}

        {!searchInput && trending.length > 0 && (
          <div>
            <h2>trending searches...</h2>
            {trending.map((item) => (
              <div
                key={item.query}
                onClick={() => setSearchInput(item.query)}
                className="w-full max-w-4xl bg-black flex px-4"
              >
                <p className="bg-black w-full my-1 opacity-70">{item.query}</p>
                <X />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {loading ? (
          <p>Searching...</p>
        ) : (
          result?.results?.results?.map((item, index) => (
            <div
              key={index}
              className="bg-black text-white opacity-90 p-2 flex flex-col"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 p-3 rounded-lg"
              >
                {item.url}
              </a>
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm opacity-70">{item.snippet}</p>
            </div>
          ))
        )}
        <div>
          {result?.results?.results && (
            <div className="flex justify-center items-center">
              <button
                onClick={previousPage}
                className="bg-gray-600 p-2 m-2"
                disabled={page === 1}
              >
                <ChevronLeft />
              </button>
              <div>
                <span className="font-bold mx-4">
                  Page {result?.results?.page} of {result?.results?.totalPages}
                </span>
              </div>
              <button
                onClick={nextPage}
                className="bg-blue-600 p-2 m-2"
                disabled={page >= result?.results?.totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

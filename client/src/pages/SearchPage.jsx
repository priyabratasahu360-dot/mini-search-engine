import { useState, useRef, useEffect } from "react";

import {
  getSuggestions,
  getTrendingSearches,
  searchPages,
} from "../services/SearchApi";
import { ArrowUpRight, Search, TrendingUp } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResults";
export const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestion, setSuggestion] = useState([]);
  const [trending, setTrending] = useState([]);

  const debounceRef = useRef(null);
  const latestQueryRef = useRef("");

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
      setResult(data);
      // console.log(data);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;

    latestQueryRef.current = value;

    setSearchInput(value);
    setResult(null);

    
    if (!value.trim()) {
      clearTimeout(debounceRef.current);
      setResult(null);
      setSuggestion([]);
      latestQueryRef.current = "";
      return;
    }

    if (value.length < 2) {
      setSuggestion([]);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try{

        
        const data = await getSuggestions(value);
        
        if(latestQueryRef.current !== value){
          return;
        }
        
        setSuggestion(data.suggestion);
      }
      catch(error){
        if(error.name === "CanceledError" || error.code === "ERR_CANCELED"){
          return;
        }
        console.error(error);
      }
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
    <div className="flex flex-col bg-black text-white min-h-screen flex items-center">
      <h1 className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-900 self-center mt-15">
        Search...
      </h1>

      <div className="w-full flex flex-col items-center mt-10">
        <SearchBar searchInput={searchInput} handleInputChange={handleInputChange} handleSearch={handleSearch}/>
        {!result && suggestion.map((suggestion) => (
          <div
            key={suggestion}
            onClick={async() => {
              setSearchInput(suggestion);
              setSuggestion([]);
              setPage(1);
              
              const data = await searchPages(suggestion, 1);
              setResult(data);
            }
            }
            className="w-full max-w-4xl bg-black flex items-center gap-3 px-4 mt-5"
          >
            <Search className="opacity-70 size-6 rounded-full bg-gray-700 p-1"/>
            <p className="bg-black w-full opacity-70">{suggestion}</p>
            <ArrowUpRight className="opacity-70"/>
          </div>
        ))}

        {!searchInput && trending.length > 0 && (
          <div className="w-full max-w-4xl">
            <h2 className="px-4 opacity-50 font-serif mt-5">Trending searches</h2>
            {trending.map((item) => (
              <div
                key={item.query}
                onClick={() => setSearchInput(item.query)}
                className="w-full max-w-4xl bg-black flex px-4 flex items-center gap-3"
              >
                <TrendingUp className="opacity-70 size-6 rounded-full bg-gray-700 p-1"/>
                <p className="bg-black w-full my-2 opacity-70">{item.query}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wrong query correction*/}
      <div className="w-full max-w-4xl flex my-4">
        {result && (
          <div className="flex gap-2 left-0">
            <p className="text-lg font-serif">Showing results for</p>
            <span className="text-blue-500 font-serif self-center text-lg underline font-bold">
              <span>
                {result?.results?.correctedQuery?.join(" ")}
              </span>
            </span>
          </div>
        )}
      </div>
      <SearchResults loading={loading} result={result} previousPage={previousPage} page={page} nextPage={nextPage} setSuggestion={setSuggestion}/>
    </div>
  );
};

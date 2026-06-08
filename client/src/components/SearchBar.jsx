import { Search } from "lucide-react";
export const SearchBar = ({searchInput, handleInputChange, handleSearch}) => {
    return(
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            placeholder="Search..."
            className="w-full flex-1 text-lg py-2 px-6 bg-black outline-none border-b border-gray-500 opacity-70"
            value={searchInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="text-white rounded-full absolute right-4 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
          >
            <Search className="size-5" />
          </button>
        </div>
    )
}
import { ChevronLeft, ChevronRight } from "lucide-react";
export const SearchResults = ({
  loading,
  result,
  previousPage,
  page,
  nextPage,
}) => {
  return (
    <div className="bg-black flex flex-col max-w-4xl w-full gap-2 mt-4">
      {loading ? (
        <p>Searching...</p>
      ) : (
        result?.results?.results?.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 text-white rounded-lg opacity-90 p-2 flex flex-col"
          >
            <div className="flex gap-2 items-center mb-4">

            <img
              src={item.favicon}
              alt="favicon"
              className="size-8"
              />
            <div className="flex flex-col">
              <p className="text-lg">{item.siteName}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-70"
              >
              {item.url}
            </a>
              </div>
                </div>
            <h2 className="text-lg font-semibold text-blue-300 my-2">
              {item.title}
            </h2>
            <p className="text-sm opacity-70">{item.snippet ||item.description}</p>
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
  );
};

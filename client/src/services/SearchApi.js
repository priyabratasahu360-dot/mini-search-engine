import { axiosInstance } from "../libs/axios";

let suggestionController;

export const searchPages = async (query, page) => {

  const res = await axiosInstance.get("/search", {
    params: {
      q: query,
      page,
    },
  });

  return res.data;
};

export const getSuggestions = async(query) => {
  if(suggestionController){
    suggestionController.abort();
  }

  suggestionController = new AbortController();
  const res = await axiosInstance.get("/search/suggestions", {
    params: {
      q: query
    },
    signal: suggestionController.signal
  })

  return res.data;
}


export const getTrendingSearches = async() => {
  const res = await axiosInstance.get("/search/trending");

  return res.data;
}
import { axiosInstance } from "../libs/axios";

let controller;

export const searchPages = async (query, page) => {

  if(controller){
    controller.abort();
  }

  controller = new AbortController();

  const res = await axiosInstance.get("/search", {
    params: {
      q: query,
      page,
    },
    signal: controller.signal
  });

  return res.data;
};

export const getSuggestions = async(query) => {
  const res = await axiosInstance.get("/search/suggestions", {
    params: {
      q: query
    }
  })

  return res.data;
}

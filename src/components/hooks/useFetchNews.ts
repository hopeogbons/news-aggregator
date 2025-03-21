import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchNews } from "../../redux/slices/newsSlice";

export const useFetchNews = () => {
  const dispatch = useAppDispatch();
  const { lastKeyword, extractedKeywords, mergedNews, error, loading } =
    useAppSelector((state) => state.news);

  useEffect(() => {
    if (lastKeyword !== "") {
      try {
        dispatch(fetchNews(lastKeyword));
      } catch (error) {
        console.error("Failed to fetch news: ", error);
      }
    }
  }, [dispatch, lastKeyword]);

  return { lastKeyword, extractedKeywords, mergedNews, loading, error };
};

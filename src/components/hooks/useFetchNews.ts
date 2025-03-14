import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchNews } from "../../redux/slices/newsSlice";

export const useFetchNews = () => {
  const dispatch = useAppDispatch();
  const { mergedNews, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    const searchPhrase = "world+news";
    encodeURIComponent(`"${searchPhrase}"`);
    dispatch(fetchNews(searchPhrase));
  }, [dispatch]);

  return { mergedNews, loading, error };
};

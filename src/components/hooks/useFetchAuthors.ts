import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchAuthors } from "../../redux/slices/authorsSlice";

export const useFetchAuthors = () => {
  const dispatch = useAppDispatch();
  const { mergedAuthors, loading, error } = useAppSelector(
    (state) => state.authors
  );
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const mergedNews = useAppSelector((state) => state.news.mergedNews);

  useEffect(() => {
    try {
      dispatch(fetchAuthors());
    } catch (error) {
      console.error("Failed to fetch authors: ", error);
    }
  }, [dispatch, selectedSources, mergedNews]);

  return { mergedAuthors, loading, error };
};

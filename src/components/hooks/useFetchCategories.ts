import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchCategories } from "../../redux/slices/categoriesSlice";

export const useFetchCategories = () => {
  const dispatch = useAppDispatch();
  const { mergedCategories, loading, error } = useAppSelector(
    (state) => state.categories
  );
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );
  const mergedNews = useAppSelector((state) => state.news.mergedNews);

  useEffect(() => {
    try {
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Failed to fetch categories: ", error);
    }
  }, [dispatch, selectedSources, mergedNews]);

  return { mergedCategories, loading, error };
};

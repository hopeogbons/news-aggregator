import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchCategories } from "../../redux/slices/categoriesSlice";

export const useFetchCategories = () => {
  const { mergedCategories, loading, error } = useAppSelector(
    (state) => state.categories
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return { mergedCategories, loading, error };
};

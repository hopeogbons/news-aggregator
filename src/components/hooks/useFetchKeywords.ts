import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchKeywords } from "../../redux/slices/keywordsSlice";

export const useFetchKeywords = () => {
  const { keywords, loading, error } = useAppSelector(
    (state) => state.keywords
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchKeywords());
  }, [dispatch]);

  return { keywords, loading, error };
};

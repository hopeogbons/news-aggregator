import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchAuthors } from "../../redux/slices/authorsSlice";

export const useFetchAuthors = () => {
  const { mergedAuthors, loading, error } = useAppSelector(
    (state) => state.authors
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  return { mergedAuthors, loading, error };
};

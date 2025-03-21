import { FC } from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { defaultSources, toggleSource } from "../../redux/slices/sourcesSlice";

const NewsSources: FC = () => {
  const dispatch = useAppDispatch();
  const selectedSources = useAppSelector(
    (state) => state.sources.selectedSources
  );

  const handleToggle = (source: string) => {
    try {
      dispatch(toggleSource(source));
    } catch (error) {
      console.error("Failed to toggle source: ", error);
    }
  };

  return (
    <FormGroup>
      {defaultSources.map((source) => (
        <FormControlLabel
          key={source}
          control={
            <Checkbox
              checked={selectedSources.includes(source)}
              onChange={() => handleToggle(source)}
            />
          }
          label={
            {
              newYorkTimes: "New York Times",
              theGuardian: "The Guardian",
              newsAPI: "NewsAPI",
            }[source]
          }
          name={source.toLowerCase()}
        />
      ))}
      <FormControlLabel
        control={<Checkbox disabled />}
        label="BBC News"
        name="bbcnews"
      />
    </FormGroup>
  );
};

export default NewsSources;

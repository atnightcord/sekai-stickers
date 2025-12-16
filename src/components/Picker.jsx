import {
  ImageList,
  ImageListItem,
  Popover,
  TextField,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Button } from "@radix-ui/themes";
import { useState, useMemo, useCallback } from "react";
import characters from "../characters.json";
import charactersSC from "../characters-sc.json";

// eslint-disable-next-line react/prop-types
export default function Picker({
  setCharacter,
  secondaryCharacters = charactersSC,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

  // Helper function to create memoized image list items
  const createImageListItems = useCallback(
    (data, source = "primary") => {
      const s = search.toLowerCase();
      return data.map((c, index) => {
        if (
          s === c.id ||
          c.name.toLowerCase().includes(s) ||
          c.character.toLowerCase().includes(s)
        ) {
          return (
            <ImageListItem
              key={index}
              onClick={() => {
                handleClose();
                setCharacter(c, source);
              }}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.5,
                },
                "&:active": {
                  opacity: 0.8,
                },
              }}
            >
              <img
                src={`/img/${c.img}`}
                srcSet={`/img/${c.img}`}
                alt={c.name}
                loading="lazy"
              />
            </ImageListItem>
          );
        }
        return null;
      });
    },
    [search, setCharacter]
  );

  // Memoize the filtered image list items to avoid recomputing them
  // at every render
  const memoizedImageListItems = useMemo(
    () => createImageListItems(characters, "primary"),
    [createImageListItems]
  );

  const memoizedSecondaryImageListItems = useMemo(
    () =>
      secondaryCharacters
        ? createImageListItems(secondaryCharacters, "secondary")
        : [],
    [secondaryCharacters, createImageListItems]
  );

  return (
    <div>
      <Button
        aria-describedby={id}
        size="3"
        color="secondary"
        onClick={handleClick}
      >
        Pick character
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="character tabs"
          >
            <Tab label="Project Sekai" />
            {secondaryCharacters && <Tab label="Shiny Colors" />}
          </Tabs>
        </Box>
        <div className="picker-search">
          <TextField
            label="Search character"
            size="small"
            color="secondary"
            value={search}
            multiline={true}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="image-grid-wrapper">
          {tabValue === 0 && (
            <ImageList
              sx={{
                width: window.innerWidth < 600 ? 300 : 500,
                height: 450,
                overflow: "visible",
              }}
              cols={window.innerWidth < 600 ? 3 : 4}
              rowHeight={140}
              className="image-grid"
            >
              {memoizedImageListItems}
            </ImageList>
          )}
          {tabValue === 1 && secondaryCharacters && (
            <ImageList
              sx={{
                width: window.innerWidth < 600 ? 300 : 500,
                height: 450,
                overflow: "visible",
              }}
              cols={window.innerWidth < 600 ? 3 : 4}
              rowHeight={140}
              className="image-grid"
            >
              {memoizedSecondaryImageListItems}
            </ImageList>
          )}
        </div>
      </Popover>
    </div>
  );
}

import {
  Button,
  Popover,
  Tabs,
  TextField,
} from "@radix-ui/themes";
import { useState, useMemo, useCallback } from "react";
import characters from "../characters.json";
import charactersSC from "../characters-sc.json";

export default function Picker({
  setCharacter,
  secondaryCharacters = charactersSC,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState("0");

  const createImageListItems = useCallback(
    (data) => {
      const s = search.toLowerCase();
      return data.map((c, index) => {
        if (
          s === c.id ||
          c.name.toLowerCase().includes(s) ||
          c.character.toLowerCase().includes(s)
        ) {
          return (
            <button
              type="button"
              key={`${c.id}-${index}`}
              className="picker-char-btn"
              onClick={() => {
                setOpen(false);
                setCharacter(c);
              }}
            >
              <img
                src={`/img/${c.img}`}
                srcSet={`/img/${c.img}`}
                alt={c.name}
                loading="lazy"
              />
            </button>
          );
        }
        return null;
      });
    },
    [search, setCharacter]
  );

  const memoizedImageListItems = useMemo(
    () => createImageListItems(characters),
    [createImageListItems]
  );

  const memoizedSecondaryImageListItems = useMemo(
    () =>
      secondaryCharacters ? createImageListItems(secondaryCharacters) : [],
    [secondaryCharacters, createImageListItems]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button size="3" color="gray">
          Pick character
        </Button>
      </Popover.Trigger>
      <Popover.Content className="picker-popover modal" align="start">
        <Tabs.Root value={tabValue} onValueChange={setTabValue}>
          <Tabs.List aria-label="character tabs">
            <Tabs.Trigger value="0">Project Sekai</Tabs.Trigger>
            {secondaryCharacters && (
              <Tabs.Trigger value="1">Shiny Colors</Tabs.Trigger>
            )}
          </Tabs.List>
          <div className="picker-search">
            <TextField.Root
              size="2"
              className="w-full"
              placeholder="Search character"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="image-grid-wrapper">
            <Tabs.Content value="0">
              <div className="image-grid picker-char-grid">
                {memoizedImageListItems}
              </div>
            </Tabs.Content>
            {secondaryCharacters && (
              <Tabs.Content value="1">
                <div className="image-grid picker-char-grid">
                  {memoizedSecondaryImageListItems}
                </div>
              </Tabs.Content>
            )}
          </div>
        </Tabs.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
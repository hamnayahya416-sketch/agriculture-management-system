import { IconSearch } from "./icons";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  id = "search",
}) {
  return (
    <div className="search search--sm">
      <IconSearch size={15} />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  );
}

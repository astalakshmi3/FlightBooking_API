type Props = {
    search: string;
    onSearchChange: (value: string) => void;
};

const SearchBar = ({ search, onSearchChange }: Props) => {
    return (
        <input
            className="w-full rounded-xl border bg-white py-3 px-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 md:w-96"
            placeholder="Search destination or flight number"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
        />
    );
};

export default SearchBar;
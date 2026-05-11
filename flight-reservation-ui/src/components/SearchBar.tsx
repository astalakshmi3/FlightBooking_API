import {Search} from "lucide-react";
type Props = {
    search: string;
    onSearchChange: (value: string) => void;
};

const SearchBar = ({ search, onSearchChange }: Props) => {
    return (
        <div className="relative w-full md:w-96">
            <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
            />

        <input
            className="w-full rounded-xl border bg-white py-3 px-4 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 md:w-96"
            placeholder="Search destination or flight number"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
        />
        </div>
    );
};

export default SearchBar;
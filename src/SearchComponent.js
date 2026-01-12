import React, { useState } from 'react';
import './SearchComponent.css';

const SearchComponent = ({ data, searchKey, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter the data based on the search term
        const filteredResults = data.filter((item) => {
            const searchValue = item[searchKey]?.toLowerCase() || '';
            return searchValue.includes(value.toLowerCase());
        });

        // Pass filtered results to parent
        if (onSearch) {
            onSearch(filteredResults);
        }
    };

    return (
        <div className="search-wrapper">
            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search students by name..."
            />
        </div>
    );
};

export default SearchComponent;

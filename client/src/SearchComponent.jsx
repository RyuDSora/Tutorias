import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Importar el ícono de la lupa

// eslint-disable-next-line react/prop-types
function SearchComponent({ isOpen, closeSearch, onSearch }) {
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSearch();
      } else if (event.key === 'E') {
        handleSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSearch, onSearch]);

  const handleSearch = () => {
    onSearch(searchTerm);
    closeSearch();
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
      <div className="flex justify-center items-start mt-20">
        <div ref={searchRef} className="bg-white p-6 rounded shadow-lg w-3/4 md:w-1/2">
          <div className="relative">
            <input
              autoFocus
              type="search"
              placeholder="Buscar..."
              className="border border-gray-300 p-3 rounded w-full pr-10"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'E') {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;

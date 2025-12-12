'use client'

const SearchOverlay = ({ isOpen, onClose, searchQuery, onSearchQueryChange, searchResults, onSearch }) => {
    // Mock Data
    const mockSearchResults = [
        { id: 1, name: 'Organic Fertilizer 50kg', category: 'Fertilizers', price: '₦15,000' },
        { id: 2, name: 'Tomato Seeds (Hybrid)', category: 'Seeds', price: '₦2,500' },
        { id: 3, name: 'Irrigation Pump System', category: 'Equipment', price: '₦85,000' },
        { id: 4, name: 'NPK Fertilizer 20-10-10', category: 'Fertilizers', price: '₦12,000' },
        { id: 5, name: 'Garden Tractor', category: 'Equipment', price: '₦450,000' }
    ];
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Search Container */}
            <div className="relative z-10 flex items-start justify-center pt-20 px-4">
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl">
                    {/* Search Input */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                            <Search size={24} className="text-[#7CB342] flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search for seeds, fertilizers, equipment, and more..."
                                className="flex-1 text-lg outline-none text-gray-700 placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => onSearchQueryChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                                autoFocus
                            />
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
                                aria-label="Close search"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <button
                            onClick={onSearch}
                            className="mt-4 w-full py-3 bg-gradient-to-r from-[#7CB342] to-[#558B2F] text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                        >
                            Search
                        </button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            <div className="p-4 space-y-2">
                                <p className="text-sm text-gray-500 px-2 mb-3">
                                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                </p>
                                {searchResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        href={`/product/${result.id}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F5F5F5] transition-all duration-200 group"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#F5F5F5] to-[#E8F5E9] rounded-xl flex items-center justify-center">
                                                <Package size={24} className="text-[#7CB342]" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 group-hover:text-[#7CB342] transition-colors">
                                                    {result.name}
                                                </p>
                                                <p className="text-sm text-gray-500">{result.category}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#7CB342]">{result.price}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : searchQuery && searchResults.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No results found</p>
                                <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#E8F5E9] to-[#C5E1A5] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={32} className="text-[#7CB342]" />
                                </div>
                                <p className="text-gray-600 font-medium mb-4">Popular Searches</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {['Seeds', 'Fertilizers', 'Equipment', 'Organic', 'Irrigation'].map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => {
                                                onSearchQueryChange(tag);
                                                onSearch();
                                            }}
                                            className="px-4 py-2 bg-[#F5F5F5] hover:bg-[#7CB342] hover:text-white rounded-full text-sm font-medium transition-all duration-200"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay
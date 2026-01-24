import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import type { Drama } from '../hooks/useDramas';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const searchDramas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.data || []);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchDramas, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-2">
      <div className="max-w-md mx-auto px-4">
        <div className="sticky top-0 z-10 bg-zinc-950 pb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dramas..."
              className="w-full bg-zinc-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {results.map((drama) => (
              <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="block">
                <div className="aspect-[2/3] rounded-lg overflow-hidden">
                  <img src={drama.cover} alt={drama.bookName} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-medium mt-2 line-clamp-2">{drama.bookName}</h3>
              </Link>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">No results found for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

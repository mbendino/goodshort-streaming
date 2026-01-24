import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useDramas } from '../hooks/useDramas';

const Home = () => {
  const { dramas, loading, hasMore, loadMore } = useDramas();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (loading && dramas.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20 pt-2">
      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* Featured */}
        {dramas[0] && (
          <Link to={`/watch/${dramas[0].bookId}`} className="block">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
              <img src={dramas[0].cover} alt={dramas[0].bookName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded mb-2">Featured</div>
                <h1 className="text-xl font-bold mb-2 line-clamp-2">{dramas[0].bookName}</h1>
                <div className="btn-primary inline-flex items-center gap-2">
                  <Play size={16} /> Watch Now
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Drama Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">For You</h2>
          <div className="grid grid-cols-3 gap-3">
            {dramas.slice(1).map((drama) => (
              <Link key={drama.bookId} to={`/watch/${drama.bookId}`} className="block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <img src={drama.cover} alt={drama.bookName} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-sm font-medium mt-2 line-clamp-2">{drama.bookName}</h3>
              </Link>
            ))}
          </div>
          <div ref={loaderRef} className="flex justify-center py-4">
            {loading && <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

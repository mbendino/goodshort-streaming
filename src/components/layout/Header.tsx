import { Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useChannel, channels } from '../../store/channel'

export default function Header() {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const { channelId, setChannelId } = useChannel();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="flex items-center justify-between h-full px-4 max-w-md mx-auto">
        <Link to="/" className="text-xl font-bold text-white">GoodShort</Link>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-sm">
              {channels.find(c => c.id === channelId)?.flag || '🌐'}
            </button>
            
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl w-40 overflow-hidden z-50 shadow-xl">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => { setChannelId(channel.id); setShowMenu(false); }}
                    className={`w-full text-left px-3 py-2 hover:bg-zinc-800 transition-colors flex items-center gap-2 text-sm ${channelId === channel.id ? 'bg-zinc-800 text-red-400' : 'text-white'}`}
                  >
                    <span>{channel.flag}</span>
                    <span>{channel.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isSearchPage && (
            <Link to="/search" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Search size={20} className="text-zinc-400" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChannelState {
  channelId: string;
  setChannelId: (id: string) => void;
}

export const useChannel = create<ChannelState>()(
  persist(
    (set) => ({
      channelId: '562',
      setChannelId: (channelId) => set({ channelId }),
    }),
    { name: 'goodshort-channel' }
  )
);

export const channels = [
  { id: '562', name: 'Indonesia', flag: '🇮🇩' },
  { id: '564', name: 'Portugal', flag: '🇵🇹' },
  { id: '565', name: 'Korea', flag: '🇰🇷' },
  { id: '568', name: 'Thailand', flag: '🇹🇭' },
];

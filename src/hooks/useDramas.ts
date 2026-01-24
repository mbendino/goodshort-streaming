import { useState, useEffect, useCallback } from 'react';
import { useChannel } from '../store/channel';

export interface Drama {
  bookId: string;
  bookName: string;
  cover: string;
  chapterCount: number;
  introduction?: string;
  viewCountDisplay?: string;
}

export interface BookDetail {
  bookId: string;
  bookName: string;
  cover: string;
  chapterCount: number;
  introduction: string;
  labels: string[];
}

export interface Video {
  id: number;
  name: string;
}

export interface PlayData {
  m3u8: string;
  keyData: string;
  episode: string;
}

export const useDramas = () => {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { channelId } = useChannel();

  useEffect(() => {
    setDramas([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    fetch(`/api/home?channelId=${channelId}&page=1&pageSize=20`)
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        setDramas(list);
        setHasMore(list.length >= 20);
        setPage(2);
      })
      .finally(() => setLoading(false));
  }, [channelId]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    fetch(`/api/home?channelId=${channelId}&page=${page}&pageSize=20`)
      .then(res => res.json())
      .then(data => {
        const list = data.data || [];
        setDramas(prev => [...prev, ...list]);
        setHasMore(list.length >= 20);
        setPage(p => p + 1);
      })
      .finally(() => setLoading(false));
  }, [page, channelId, loading, hasMore]);

  return { dramas, loading, hasMore, loadMore };
};

export const useBookDetail = (bookId: string | undefined) => {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    fetch(`/api/book?id=${bookId}`)
      .then(res => res.json())
      .then(data => setBook(data.data?.book || null))
      .finally(() => setLoading(false));
  }, [bookId]);

  return { book, loading };
};

export const useVideos = (bookId: string | undefined) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    fetch(`/api/chapters?id=${bookId}`)
      .then(res => res.json())
      .then(data => setVideos(data.data?.list || []))
      .finally(() => setLoading(false));
  }, [bookId]);

  return { videos, loading };
};

export const usePlay = () => {
  const [playData, setPlayData] = useState<PlayData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadVideo = useCallback((bookId: string, chapterId: number) => {
    setLoading(true);
    fetch(`/api/play?bookId=${bookId}&chapterId=${chapterId}`)
      .then(res => res.json())
      .then(data => setPlayData(data))
      .finally(() => setLoading(false));
  }, []);

  return { playData, loading, loadVideo };
};

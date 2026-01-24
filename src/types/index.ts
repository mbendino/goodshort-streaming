export interface Tag {
  tagId: number
  tagName: string
  tagEnName: string
}

export interface Drama {
  bookId: string
  bookName: string
  introduction: string
  cover: string
  chapterCount: number
  playCount: string
  tags: string[]
  tagDetails: Tag[]
}

export interface Chapter {
  chapterId: string
  chapterIndex: number
  isCharge: number
  isPay: number
}

export interface VideoUrls {
  video_480?: string
  video_720?: string
  video_1080?: string
}

export interface PlayData {
  id: number
  name: string
  episode: number
  total: number
  video: VideoUrls
  expires: number
  expires_in: number
}

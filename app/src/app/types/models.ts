export type ThemeName =
  | 'systemDark'
  | 'systemLight'
  | 'freshMint'
  | 'fineRoyal'
  | 'purpleHaze'
  | 'hackTheSystem';

export type User = {
  id: string;
  email: string;
  displayName?: string;
  favoriteMusic?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  createdAtISO: string;
  likedByMe: boolean;
};
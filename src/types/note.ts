export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string; // e.g. "purple", "indigo", "rose", "amber", "emerald", "sky"
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  isShared: boolean;
  shareId?: string; // unique token for sharing
  shareExpiresAt?: number | null; // epoch ms or null for permanent
}

export type NoteFormData = {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
};

export type FilterType = "all" | "pinned" | "shared" | "tag";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

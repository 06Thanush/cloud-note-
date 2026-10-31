import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Note, NoteFormData } from "@/types/note";

const COLLECTION_NAME = "notes";

/**
 * Subscribes to real-time updates of user notes.
 * Automatically sorts pinned notes first, then by updatedAt descending.
 */
export const subscribeUserNotes = (
  userId: string,
  onUpdate: (notes: Note[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const notesRef = collection(db, COLLECTION_NAME);
  const q = query(notesRef, where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const notes: Note[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        notes.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title || "Untitled Note",
          content: data.content || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          isPinned: Boolean(data.isPinned),
          color: data.color || "purple",
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
          isShared: Boolean(data.isShared),
          shareId: data.shareId,
          shareExpiresAt: data.shareExpiresAt ?? null,
        });
      });

      // Sort: pinned first, then newest updatedAt first
      notes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
      });

      onUpdate(notes);
    },
    (err) => {
      console.error("Firestore subscribeUserNotes error:", err);
      if (onError) onError(err);
    }
  );
};

/**
 * Creates a new note in Firestore under the user account.
 */
export const createNote = async (
  userId: string,
  data: Partial<NoteFormData>
): Promise<string> => {
  const notesRef = collection(db, COLLECTION_NAME);
  const now = Date.now();
  const shareId = typeof crypto !== "undefined" && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);

  const docRef = await addDoc(notesRef, {
    userId,
    title: data.title?.trim() || "Untitled Note",
    content: data.content || "",
    tags: data.tags || [],
    isPinned: Boolean(data.isPinned),
    color: data.color || "purple",
    createdAt: now,
    updatedAt: now,
    isShared: false,
    shareId,
    shareExpiresAt: null,
  });

  return docRef.id;
};

/**
 * Updates an existing note.
 */
export const updateNote = async (
  noteId: string,
  updates: Partial<Omit<Note, "id" | "userId">>
): Promise<void> => {
  const noteRef = doc(db, COLLECTION_NAME, noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: Date.now(),
  });
};

/**
 * Deletes a note permanently.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
  const noteRef = doc(db, COLLECTION_NAME, noteId);
  await deleteDoc(noteRef);
};

/**
 * Toggles pinned state of a note.
 */
export const togglePinNote = async (
  noteId: string,
  currentPinned: boolean
): Promise<void> => {
  await updateNote(noteId, { isPinned: !currentPinned });
};

/**
 * Configures note public sharing options.
 */
export const updateShareSettings = async (
  noteId: string,
  isShared: boolean,
  shareExpiresAt?: number | null
): Promise<void> => {
  const updates: Record<string, any> = {
    isShared,
    updatedAt: Date.now(),
  };

  if (shareExpiresAt !== undefined) {
    updates.shareExpiresAt = shareExpiresAt;
  }

  const noteRef = doc(db, COLLECTION_NAME, noteId);
  await updateDoc(noteRef, updates);
};

/**
 * Fetches a shared note by its unique share token.
 */
export const getSharedNote = async (
  shareId: string
): Promise<{ note: Note | null; status: "found" | "not_found" | "expired" | "disabled" }> => {
  try {
    const notesRef = collection(db, COLLECTION_NAME);
    const q = query(notesRef, where("shareId", "==", shareId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { note: null, status: "not_found" };
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    if (!data.isShared) {
      return { note: null, status: "disabled" };
    }

    if (data.shareExpiresAt && data.shareExpiresAt < Date.now()) {
      return { note: null, status: "expired" };
    }

    const note: Note = {
      id: docSnap.id,
      userId: data.userId,
      title: data.title || "Untitled Note",
      content: data.content || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      isPinned: Boolean(data.isPinned),
      color: data.color || "purple",
      createdAt: data.createdAt || Date.now(),
      updatedAt: data.updatedAt || Date.now(),
      isShared: true,
      shareId: data.shareId,
      shareExpiresAt: data.shareExpiresAt,
    };

    return { note, status: "found" };
  } catch (error) {
    console.error("Error fetching shared note:", error);
    return { note: null, status: "not_found" };
  }
};

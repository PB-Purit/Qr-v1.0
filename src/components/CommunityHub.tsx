"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  MessageCircle,
  Paperclip,
  Pencil,
  Plus,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

type BoardPost = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
  attachments: Attachment[];
};

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type ChatMessage = {
  id: string;
  name: string;
  message: string;
  sentAt: string;
  maskedIp: string;
};

const postsStorageKey = "store-pm-1-webboard";
const defaultPostAuthor = "Store PM 1";
const boardDatabaseName = "store-pm-1-board";
const boardStoreName = "posts";
const maxAttachmentSize = 10 * 1024 * 1024;
const maxAttachmentCount = 5;

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const openBoardDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(boardDatabaseName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(boardStoreName);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const loadBoardPosts = async () => {
  const database = await openBoardDatabase();
  return new Promise<BoardPost[] | null>((resolve, reject) => {
    const request = database
      .transaction(boardStoreName, "readonly")
      .objectStore(boardStoreName)
      .get("all");
    request.onsuccess = () => resolve((request.result as BoardPost[] | undefined) || null);
    request.onerror = () => reject(request.error);
  });
};

const saveBoardPosts = async (posts: BoardPost[]) => {
  const database = await openBoardDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(boardStoreName, "readwrite");
    transaction.objectStore(boardStoreName).put(posts, "all");
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getUniqueAuthors = (posts: BoardPost[]) => {
  const authors = new Map<string, string>();
  posts.forEach((post) => {
    const author = post.author?.trim() || "ไม่ระบุชื่อ";
    const authorKey = author.normalize("NFKC").toLocaleLowerCase();
    if (!authors.has(authorKey)) authors.set(authorKey, author);
  });
  return Array.from(authors.values());
};

const readFile = (file: File) =>
  new Promise<Attachment>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: makeId(),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: String(reader.result),
      });
    reader.onerror = () => reject(new Error("อ่านไฟล์ไม่สำเร็จ"));
    reader.readAsDataURL(file);
  });

export function CommunityHub() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postAuthor, setPostAuthor] = useState(defaultPostAuthor);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [chatName, setChatName] = useState("Store PM 1");
  const [chatMessage, setChatMessage] = useState("");
  const [chatError, setChatError] = useState("");
  const [chatVisible, setChatVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const storedPosts = await loadBoardPosts();
        const legacyPosts = window.localStorage.getItem(postsStorageKey);
        const postsToUse = storedPosts || (legacyPosts ? (JSON.parse(legacyPosts) as BoardPost[]) : []);
        if (!cancelled) setPosts(postsToUse);
        if (!storedPosts && postsToUse.length > 0) await saveBoardPosts(postsToUse);
        window.localStorage.removeItem(postsStorageKey);

      } catch {
        const legacyPosts = window.localStorage.getItem(postsStorageKey);
        if (legacyPosts && !cancelled) setPosts(JSON.parse(legacyPosts) as BoardPost[]);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveBoardPosts(posts).catch(() => {
      setAttachmentError("ไม่สามารถบันทึกข้อมูล Webboard ได้");
    });
  }, [posts, ready]);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const response = await fetch("/api/chat", { cache: "no-store" });
        if (!response.ok) throw new Error("โหลดแชตไม่สำเร็จ");
        const data = (await response.json()) as { messages: ChatMessage[] };
        if (!cancelled) setMessages(data.messages);
      } catch {
        if (!cancelled) setChatError("ไม่สามารถเชื่อมต่อ Live chat ได้");
      }
    };

    void loadMessages();
    const refreshOnVisibilityChange = () => {
      if (document.visibilityState === "visible") void loadMessages();
    };
    document.addEventListener("visibilitychange", refreshOnVisibilityChange);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", refreshOnVisibilityChange);
    };
  }, []);

  /*
   * Keep the legacy key only for migration. Posts and attachments are stored in IndexedDB
   * because localStorage cannot reliably hold files up to 10 MB.
   */
  /*
    try {
      const storedPosts = window.localStorage.getItem(postsStorageKey);
      const storedMessages = window.localStorage.getItem(chatStorageKey);
      if (storedPosts) setPosts(JSON.parse(storedPosts) as BoardPost[]);
      if (storedMessages) setMessages(JSON.parse(storedMessages) as ChatMessage[]);
    } catch {
      window.localStorage.removeItem(postsStorageKey);
      window.localStorage.removeItem(chatStorageKey);
    } finally {
      setReady(true);
    }
  */

  const resetPostForm = () => {
    setPostTitle("");
    setPostBody("");
    setAttachments([]);
    setAttachmentError("");
    setEditingId(null);
  };

  const addAttachments = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    setAttachmentError("");

    if (selectedFiles.length + attachments.length > maxAttachmentCount) {
      setAttachmentError(`แนบไฟล์ได้ไม่เกิน ${maxAttachmentCount} ไฟล์ต่อโพสต์`);
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > maxAttachmentSize);
    if (oversizedFile) {
      setAttachmentError(`${oversizedFile.name} มีขนาดเกิน 10 MB`);
      return;
    }

    try {
      const newAttachments = await Promise.all(selectedFiles.map(readFile));
      setAttachments((current) => [...current, ...newAttachments]);
    } catch {
      setAttachmentError("ไม่สามารถอ่านไฟล์ที่เลือกได้");
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id));
  };

  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const author = postAuthor.trim() || defaultPostAuthor;
    const title = postTitle.trim();
    const body = postBody.trim();
    if (!title || !body) return;

    if (editingId) {
      setPosts((current) =>
        current.map((post) =>
          post.id === editingId
            ? {
                ...post,
                title,
                body,
                author,
                attachments,
                updatedAt: new Date().toISOString(),
              }
            : post,
        ),
      );
    } else {
      setPosts((current) => [
        {
          id: makeId(),
          title,
          body,
          author,
          createdAt: new Date().toISOString(),
          attachments,
        },
        ...current,
      ]);
    }
    resetPostForm();
  };

  const editPost = (post: BoardPost) => {
    setEditingId(post.id);
    setPostTitle(post.title);
    setPostBody(post.body);
    setPostAuthor(post.author?.trim() || defaultPostAuthor);
    setAttachments(post.attachments || []);
    setAttachmentError("");
  };

  const deletePost = (id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
    if (editingId === id) resetPostForm();
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = chatName.trim() || "ผู้ใช้งาน";
    const message = chatMessage.trim();
    if (!message) return;

    setChatError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      const data = (await response.json()) as { error?: string; message?: ChatMessage };
      if (!response.ok || !data.message) {
        setChatError(data.error || "ส่งข้อความไม่สำเร็จ");
        return;
      }
      setMessages((current) => [...current, data.message as ChatMessage]);
      setChatMessage("");
    } catch {
      setChatError("ไม่สามารถเชื่อมต่อ Live chat ได้");
    }
  };

  const uniqueAuthors = getUniqueAuthors(posts);

  return (
    <section
      id="webboard"
      className="animate-rise grid min-w-0 scroll-mt-24 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]"
    >
      <div className="min-w-0 rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ff7a18]">
              Community
            </p>
            <h2 className="text-lg font-bold sm:text-xl">Webboard</h2>
            {uniqueAuthors.length > 0 ? (
              <p className="mt-1 break-words text-xs text-white/50">
                ผู้โพสต์: <span className="text-white/75">{uniqueAuthors.join(" · ")}</span>
              </p>
            ) : null}
          </div>
          <MessageCircle className="text-[#ffb347]" aria-hidden="true" size={24} />
        </div>

        <form onSubmit={savePost} className="mt-4 space-y-3 rounded-xl border border-white/10 bg-[#181818] p-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">{editingId ? "แก้ไขโพสต์" : "สร้างโพสต์ใหม่"}</h3>
            {editingId ? (
              <button
                type="button"
                onClick={resetPostForm}
                className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white"
              >
                <X size={14} aria-hidden="true" /> ยกเลิก
              </button>
            ) : null}
          </div>
          <input
            value={postTitle}
            onChange={(event) => setPostTitle(event.target.value)}
            placeholder="หัวข้อโพสต์"
            maxLength={100}
            className="min-h-10 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm outline-none placeholder:text-white/40 focus:border-[#ff7a18]"
          />
          <textarea
            value={postBody}
            onChange={(event) => setPostBody(event.target.value)}
            placeholder="เขียนรายละเอียดหรือประกาศ..."
            maxLength={1000}
            rows={3}
            className="w-full resize-y rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-[#ff7a18]"
          />
          <input
            value={postAuthor}
            onChange={(event) => setPostAuthor(event.target.value)}
            placeholder="ชื่อผู้โพสต์"
            maxLength={40}
            className="min-h-10 w-full rounded-lg border border-white/15 bg-black/40 px-3 text-sm outline-none placeholder:text-white/40 focus:border-[#ff7a18]"
          />
          <div className="space-y-2">
            <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#ff7a18]/60 px-3 py-2 text-sm text-[#ffb347] hover:bg-[#ff7a18]/10">
              <Paperclip size={16} aria-hidden="true" />
              แนบไฟล์หรือรูปภาพ
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={addAttachments}
                className="sr-only"
              />
            </label>
            <p className="text-xs text-white/40">สูงสุด {maxAttachmentCount} ไฟล์, ไฟล์ละไม่เกิน 10 MB</p>
            {attachmentError ? <p className="text-xs text-red-300">{attachmentError}</p> : null}
            {attachments.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2">
                    {attachment.type.startsWith("image/") ? (
                      <img src={attachment.dataUrl} alt={attachment.name} className="h-12 w-12 shrink-0 rounded object-cover" />
                    ) : (
                      <FileText className="shrink-0 text-[#ffb347]" size={24} aria-hidden="true" />
                    )}
                    <p className="min-w-0 flex-1 truncate text-xs text-white/75" title={attachment.name}>
                      {attachment.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      aria-label={`ลบไฟล์ ${attachment.name}`}
                      title="ลบไฟล์แนบ"
                      className="shrink-0 rounded p-1 text-white/50 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={!postTitle.trim() || !postBody.trim()}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#ff7a18] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#ffb347] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            {editingId ? <Pencil size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            {editingId ? "บันทึกการแก้ไข" : "เพิ่มโพสต์"}
          </button>
        </form>

        <div className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/50">
              ยังไม่มีโพสต์ใน Webboard
            </p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="min-w-0 rounded-xl border border-white/10 bg-[#181818] p-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-white">{post.title}</h3>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/45">
                      <span className="inline-flex min-w-0 items-center gap-1 font-medium text-[#ffb347]">
                        <UserRound size={13} aria-hidden="true" />
                        <span className="break-words">{post.author?.trim() || "ไม่ระบุชื่อ"}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatDate(post.updatedAt || post.createdAt)}</span>
                      {post.updatedAt ? " · แก้ไขแล้ว" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 self-end gap-1 sm:self-start">
                    <button
                      type="button"
                      onClick={() => editPost(post)}
                      aria-label={`แก้ไข ${post.title}`}
                      title="แก้ไขโพสต์"
                      className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-[#ffb347]"
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePost(post.id)}
                      aria-label={`ลบ ${post.title}`}
                      title="ลบโพสต์"
                      className="rounded-lg p-2 text-white/60 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white/75">{post.body}</p>
                {post.attachments?.length ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {post.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.dataUrl}
                        download={attachment.name}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-black/25 p-2 hover:border-[#ff7a18]/70"
                      >
                        {attachment.type.startsWith("image/") ? (
                          <img src={attachment.dataUrl} alt={attachment.name} className="h-14 w-14 shrink-0 rounded object-cover" />
                        ) : (
                          <FileText className="shrink-0 text-[#ffb347]" size={26} aria-hidden="true" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs text-white/80" title={attachment.name}>{attachment.name}</span>
                          <span className="block text-[10px] text-white/40">{formatFileSize(attachment.size)}</span>
                        </span>
                        <Download className="shrink-0 text-white/45 group-hover:text-[#ffb347]" size={15} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>

      <div className="flex min-h-[420px] min-w-0 flex-col rounded-2xl border border-white/10 bg-[#111] p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Realtime</p>
            <h2 className="mt-0.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Live chat
            </h2>
            <p className="mt-1 text-xs text-white/45">พูดคุยแบบเรียลไทม์</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> ออนไลน์
            </span>
            <button
              type="button"
              onClick={() => setChatVisible((visible) => !visible)}
              aria-expanded={chatVisible}
              aria-label={chatVisible ? "ซ่อน Live chat" : "แสดง Live chat"}
              title={chatVisible ? "ซ่อน Live chat" : "แสดง Live chat"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/60 transition hover:border-[#ff7a18]/70 hover:bg-[#ff7a18]/10 hover:text-[#ffb347]"
            >
              {chatVisible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {chatVisible ? (
          <>
            <div className="mt-4 flex-1 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-3">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-white/45">
                  เริ่มการสนทนาได้เลย
                </div>
              ) : (
                messages.map((item) => (
                  <div key={item.id} className="rounded-lg border border-white/10 bg-[#181818] px-3 py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-[#ffb347]">{item.name}</p>
                      <time className="text-[10px] text-white/40">{formatDate(item.sentAt)}</time>
                    </div>
                    <p className="mt-1 break-words text-sm text-white/80">{item.message}</p>
                    <p className="mt-1 text-[10px] text-white/35">IP: {item.maskedIp}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={sendMessage} className="mt-3 space-y-2">
              <input
                value={chatName}
                onChange={(event) => setChatName(event.target.value)}
                placeholder="ชื่อของคุณ"
                maxLength={40}
                className="min-h-9 w-full rounded-lg border border-white/15 bg-[#181818] px-3 text-xs outline-none placeholder:text-white/40 focus:border-[#ff7a18]"
              />
              <div className="flex gap-2">
                <input
                  value={chatMessage}
                  onChange={(event) => setChatMessage(event.target.value)}
                  placeholder="พิมพ์ข้อความ..."
                  maxLength={500}
                  className="min-h-10 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#181818] px-3 text-sm outline-none placeholder:text-white/40 focus:border-[#ff7a18]"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  aria-label="ส่งข้อความ"
                  title="ส่งข้อความ"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff7a18] text-black hover:bg-[#ffb347] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={17} aria-hidden="true" />
                </button>
              </div>
              {chatError ? <p className="text-xs text-red-300">{chatError}</p> : null}
            </form>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setChatVisible(true)}
            className="mt-4 flex min-h-24 items-center gap-3 rounded-xl border border-[#ff7a18]/35 bg-[#ff7a18]/[0.06] px-4 text-left transition hover:border-[#ff7a18] hover:bg-[#ff7a18]/[0.12]"
          >
            <MessageCircle className="shrink-0 text-[#ffb347]" size={22} aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-white">แชทถูกซ่อนไว้</span>
              <span className="mt-1 block truncate text-xs text-white/50">
                {messages.length > 0
                  ? `${messages[messages.length - 1].name}: ${messages[messages.length - 1].message}`
                  : "กดเพื่อเปิด Live chat"}
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
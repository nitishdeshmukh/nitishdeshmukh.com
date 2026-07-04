import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

const fetcher = (url: string) => fetch(`${API_BASE}${url}`).then(r => r.json());

export function useProfile() { 
  return useSWR("/api/profile", fetcher); 
}

export function useProjects() { 
  return useSWR("/api/projects", fetcher); 
}

export function useBlogPosts() { 
  return useSWR("/api/blog", fetcher); 
}

export function useGuestbook() { 
  return useSWR("/api/guestbook", fetcher); 
}

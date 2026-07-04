// Calls /api/proxy/* (the Next.js Route Handler), NOT the Worker directly
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Replace /api/admin with /api/proxy
  const proxyPath = endpoint.startsWith("/api/admin") 
    ? endpoint.replace("/api/admin", "/api/proxy")
    : `/api/proxy${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    
  const res = await fetch(proxyPath, {
    ...options,
    headers: { 
      "Content-Type": "application/json", 
      ...options.headers 
    },
  });
  
  if (!res.ok) {
    let errorMsg = `API Error: ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {}
    throw new Error(errorMsg);
  }
  
  return res.json();
}

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Users, FileText, Layers, MessageSquare, Image as ImageIcon, Briefcase, GraduationCap, FolderOpen } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

const API_BASE = process.env.API_URL || "http://localhost:8787";
const API_SECRET = process.env.API_SECRET || "";

// Server-side fetch to get counts securely
async function fetchCount(entity: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/${entity}`, {
      headers: { "X-API-Key": API_SECRET },
      next: { revalidate: 0 } // no cache for admin dashboard
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage() {
  const [
    rolesCount,
    stackCount,
    experienceCount,
    educationCount,
    projectsCount,
    blogCount,
    guestbookCount,
    assetsCount
  ] = await Promise.all([
    fetchCount("roles"),
    fetchCount("stack"),
    fetchCount("experience"),
    fetchCount("education"),
    fetchCount("projects"),
    fetchCount("blog"),
    fetchCount("guestbook"),
    fetchCount("assets"),
  ]);

  const cards = [
    { title: "Roles", count: rolesCount, href: "/roles", icon: Users },
    { title: "Tech Stack", count: stackCount, href: "/stack", icon: Layers },
    { title: "Experience", count: experienceCount, href: "/experience", icon: Briefcase },
    { title: "Education", count: educationCount, href: "/education", icon: GraduationCap },
    { title: "Projects", count: projectsCount, href: "/projects", icon: FolderOpen },
    { title: "Blog Posts", count: blogCount, href: "/blog", icon: FileText },
    { title: "Guestbook", count: guestbookCount, href: "/guestbook", icon: MessageSquare },
    { title: "Assets", count: assetsCount, href: "/assets", icon: ImageIcon },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio content and digital assets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link href={card.href} key={card.title} className="group focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white rounded-xl">
            <Card className="hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors border-neutral-200 dark:border-neutral-800 h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage {card.title.toLowerCase()} &rarr;
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

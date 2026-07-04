"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@workspace/ui/components/sidebar";
import { 
  LayoutDashboard, 
  Tag, 
  Link as LinkIcon, 
  Layers, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  FileText, 
  BookOpen, 
  Music, 
  Settings, 
  Globe
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Roles", href: "/roles", icon: Tag },
  { title: "Social Links", href: "/social-links", icon: LinkIcon },
  { title: "Tech Stack", href: "/stack", icon: Layers },
  { title: "Experience", href: "/experience", icon: Briefcase },
  { title: "Education", href: "/education", icon: GraduationCap },
  { title: "Projects", href: "/projects", icon: FolderOpen },
  { title: "Blog", href: "/blog", icon: FileText },
  { title: "Guestbook", href: "/guestbook", icon: BookOpen },
  { title: "Assets", href: "/assets", icon: Music },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 py-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Globe className="h-6 w-6" />
            <span>Nitish Admin</span>
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} tooltip={item.title}>
                      <Link href={item.href} className="flex items-center gap-2 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

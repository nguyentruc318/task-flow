"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { dashboardNav } from "@/config/nav";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {dashboardNav.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={active}>
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

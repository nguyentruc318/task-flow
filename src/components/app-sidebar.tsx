import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 text-lg font-bold">TaskFlow</div>
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 text-xs text-muted-foreground">© 2026</div>
      </SidebarFooter>
    </Sidebar>
  );
}

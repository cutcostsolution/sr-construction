import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Bell, BookOpen, BriefcaseBusiness, ChevronRight, ExternalLink, FileText, FolderKanban, Image, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, Users, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

const links = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/consultations", "Consultations", BriefcaseBusiness],
  ["/admin/clients", "Clients & Leads", Users],
  ["/admin/catalogue", "Services & Projects", FolderKanban],
  ["/admin/content", "Website Content", FileText],
  ["/admin/blogs", "Blogs", BookOpen],
  ["/admin/applications", "Network Applications", Users],
  ["/admin/enquiries", "Enquiries", MessageSquare],
  ["/admin/media", "Media Library", Image],
  ["/admin/settings", "Settings & Payments", Settings],
];

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [menu, setMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const notifications = trpc.admin.notifications.useQuery(undefined, { enabled: user?.role === "admin", refetchInterval: 30_000 });
  const readAll = trpc.admin.readAllNotifications.useMutation({ onSuccess: () => utils.admin.notifications.invalidate() });
  const readOne = trpc.admin.readNotification.useMutation({ onSuccess: () => utils.admin.notifications.invalidate() });

  if (isLoading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16, background: "var(--cream)" }}>
    <span style={{ fontFamily: "Cinzel,serif", fontSize: 32, color: "var(--burgundy)", fontWeight: 700 }}>SR</span>
    <p style={{ color: "var(--muted)", fontSize: 14 }}>Opening your workspace…</p>
  </div>;
  if (!user) return null;
  if (user.role !== "admin") return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 20, textAlign: "center", padding: 20 }}>
    <h1 style={{ fontFamily: "Cinzel,serif" }}>Administrator access required</h1>
    <p style={{ color: "var(--muted)" }}>This account does not have permission to manage SR Construction.</p>
    <Link to="/" className="button">Return to Website</Link>
  </div>;

  const unread = (notifications.data ?? []).filter((n) => !n.isRead).length;
  function openNotification(id: number, type: string | null) {
    readOne.mutate({ id });
    const target = type === "consultation" || type === "payment" ? "/admin/consultations" : type === "application" ? "/admin/applications" : type === "enquiry" ? "/admin/enquiries" : "/admin";
    setNotificationsOpen(false); navigate(target); utils.admin.notifications.invalidate();
  }

  const sidebarContent = (
    <>
      <div className="admin-sidebar-head">
        <strong>SR CONSTRUCTION</strong>
        <small>Admin Workspace</small>
      </div>
      <nav>
        {links.map(([path, text, Icon]) => (
          <NavLink key={path as string} to={path as string} end={path === "/admin"} onClick={() => setMenu(false)}>
            <Icon size={18} />
            <span>{text as string}</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-foot">
        <Link to="/" target="_blank"><ExternalLink size={14} /> View Public Website</Link>
        <button onClick={logout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", cursor: "pointer", fontSize: 13, marginTop: 8, width: "100%" }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </>
  );

  return <div className="admin-layout">
    {/* Desktop Sidebar */}
    <aside className="admin-sidebar desktop-only">
      {sidebarContent}
    </aside>

    {/* Mobile Sidebar Overlay */}
    {menu && (
      <>
        <div className="admin-mobile-backdrop" onClick={() => setMenu(false)} />
        <aside className="admin-sidebar mobile-only">
          <button onClick={() => setMenu(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "var(--text)", cursor: "pointer", zIndex: 10 }}>
            <X size={24} />
          </button>
          {sidebarContent}
        </aside>
      </>
    )}

    {/* Main */}
    <div>
      <header className="admin-topbar">
        <button onClick={() => setMenu(!menu)} className="admin-menu-toggle"><Menu size={20} /></button>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--muted)" }}>SR Construction</span>
          <strong style={{ display: "block", fontSize: 14, color: "var(--ink)" }}>Admin Dashboard</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link to="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--burgundy)", fontWeight: 600 }}><ExternalLink size={14} /> View Site</Link>
          <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}>
            <Bell size={18} color="var(--muted)" />
            {unread > 0 && <b style={{ position: "absolute", top: -4, right: -4, background: "var(--burgundy)", color: "white", fontSize: 10, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</b>}
          </button>
          <span style={{ fontSize: 13, color: "var(--ink)" }}>{user.name || "Administrator"}</span>
        </div>
      </header>

      {/* Notifications Panel */}
      {notificationsOpen && <div style={{ position: "fixed", top: 64, right: 20, background: "var(--warm-white)", borderRadius: "var(--radius-lg)", boxShadow: "0 8px 32px var(--shadow-lg)", border: "1px solid var(--line)", width: 360, maxHeight: 400, overflow: "auto", zIndex: 100, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <strong style={{ fontSize: 14 }}>Notifications</strong>
          {unread > 0 && <button onClick={() => readAll.mutate()} style={{ background: "none", border: "none", color: "var(--burgundy)", fontSize: 12, cursor: "pointer" }}>Mark all read</button>}
        </div>
        {notifications.data?.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No notifications yet.</p>}
        {notifications.data?.slice(0, 12).map((n) => (
          <button key={n.id} onClick={() => openNotification(n.id, n.recordType)} style={{ display: "block", width: "100%", textAlign: "left", background: n.isRead ? "transparent" : "var(--burgundy-soft)", border: "none", padding: "12px", borderRadius: "var(--radius-sm)", cursor: "pointer", marginBottom: 4 }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--burgundy)" }}>{n.category}</span>
            <strong style={{ display: "block", fontSize: 13, margin: "4px 0" }}>{n.title}</strong>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>{n.description}</p>
          </button>
        ))}
      </div>}

      <div className="admin-content"><Outlet /></div>
    </div>
  </div>;
}

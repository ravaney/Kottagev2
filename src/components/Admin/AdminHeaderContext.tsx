import React, { createContext, useContext } from 'react';
import AdminSectionHeader, { AdminSectionHeaderProps } from './AdminSectionHeader';

const AdminPanelContext = createContext(false);
export function AdminPanelProvider({ children }: { children: React.ReactNode }) {
  return <AdminPanelContext.Provider value>{children}</AdminPanelContext.Provider>;
}
/** Shared staff pages keep their original headers outside the admin panel. */
export function AdminPageHeader({ fallback, children, ...props }: AdminSectionHeaderProps & { fallback: React.ReactNode; children?: React.ReactNode }) {
  const isAdminPanel = useContext(AdminPanelContext);
  return isAdminPanel ? <><AdminSectionHeader {...props} />{children}</> : <>{fallback}</>;
}
export function StaffPortalOnly({ children }: { children: React.ReactNode }) {
  return useContext(AdminPanelContext) ? null : <>{children}</>;
}

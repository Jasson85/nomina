'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Empleados',
    href: '/empleados',
    icon: Users,
  },
  {
    label: 'Nómina',
    href: '/nomina',
    icon: FileText,
  },
  {
    label: 'Ausencias',
    href: '/ausencias',
    icon: Clock,
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
  },
  {
    label: 'Asesor IA',
    href: '/leave-advisor',
    icon: HelpCircle,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
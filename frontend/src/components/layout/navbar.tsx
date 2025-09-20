'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null; // Não mostra a navbar se não estiver autenticado
  }

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/members', label: 'Membros' },
    { href: '/groups', label: 'Grupos' },
    { href: '/biblical-school', label: 'Escola Bíblica' },
  ];

  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-lg font-bold">
          Gestor de Igrejas
        </Link>
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-accent-foreground",
                pathname === item.href && "font-bold text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="ghost" onClick={logout} className="text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
}

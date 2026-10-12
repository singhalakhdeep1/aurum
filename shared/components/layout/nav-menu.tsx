'use client';

import Link from 'next/link';
import {
  Bitcoin,
  Building2,
  FileBarChart,
  LineChart,
  Menu,
  PiggyBank,
  Receipt,
  Repeat,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LINKS = [
  { href: '/budget', label: 'Budget', icon: PiggyBank },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
  { href: '/investments', label: 'Investments', icon: LineChart },
  { href: '/subscriptions', label: 'Subscriptions', icon: Repeat },
  { href: '/receipt', label: 'Receipts', icon: Receipt },
  { href: '/bank', label: 'Bank feeds', icon: Building2 },
  { href: '/crypto', label: 'Crypto', icon: Bitcoin },
];

const ACCOUNT_LINKS = [
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/** Menu with links to every signed-in page that is not in the main header bar. */
export default function NavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-center gap-2 cursor-pointer">
              <Icon size={16} />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {ACCOUNT_LINKS.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-center gap-2 cursor-pointer">
              <Icon size={16} />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import type { Icons } from '~/components/icons';

export type NavLink = {
  title: string;
  label?: string;
  icon?: keyof typeof Icons;
  disabled?: boolean;
  external?: boolean;
} & (
  | {
      href?: never;
      items: NavLink[];
    }
  | {
      href: string;
      items?: never;
    }
);

export const mainNav: NavLink[] = [
  {
    title: 'Our Rooms',
    href: '/rooms',
  },
  {
    title: 'Riwa Waree Onsen',
    href: '/riva-waree-onsen',
  },
  {
    title: 'Facilities',
    href: '/facilities',
  },
  {
    title: 'Membership',
    href: '/membership',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

import type { Icons } from '~/common/components/icons';
import { env } from '~/core/configs/app.env';

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

// TODO: update site config
export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: 'Nonthaburi Valley Condominium - Your Luxury Living Space',
  url: env.NEXT_PUBLIC_APP_URL,
  timezone: env.NEXT_PUBLIC_APP_TIMEZONE,
  ogImage: '/images/og.jpg',
  links: {
    instagram: 'https://instagram.com/nvc',
    facebook: 'https://facebook.com/nvc',
    line: 'https://line.me/nvc',
  },
} as const;

export const featureFlags = {
  // enableBooking: true,
} as const;

export const navConfig = {
  main: [
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
  ] as NavLink[],

  user: [
    {
      title: 'Profile',
      href: '/profile',
    },
    {
      title: 'Change Password',
      href: '/change-password',
    },
    {
      title: 'Bookings',
      href: '/bookings',
    },
  ] as NavLink[],

  footer: [
    {
      title: 'Legal',
      items: [
        { title: 'Privacy Policy', href: '/privacy' },
        { title: 'Terms of Service', href: '/terms' },
      ],
    },
    {
      title: 'Social',
      items: [
        {
          title: 'Instagram',
          href: siteConfig.links.instagram,
          external: true,
        },
        { title: 'Facebook', href: siteConfig.links.facebook, external: true },
        { title: 'Line', href: siteConfig.links.line, external: true },
      ],
    },
  ] as NavLink[],
} as const;

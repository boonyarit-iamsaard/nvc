import {
  Montserrat as FontSans,
  Playfair_Display as FontSerif,
} from 'next/font/google';

export const fontSans = FontSans({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

export const fontSerif = FontSerif({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-serif',
});

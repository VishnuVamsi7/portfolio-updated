'use client';

import dynamic from 'next/dynamic';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import CustomCursor from './components/effects/CustomCursor';
import ScrollProgress from './components/effects/ScrollProgress';
import InitialLoaderShader from './components/effects/InitialLoaderShader';

const GlobalShaderBackground = dynamic(
  () => import('./components/effects/GlobalShaderBackground'),
  { ssr: false }
);

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function Providers({ children }) {
  return (
    <div className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}>
      <GlobalShaderBackground />
      <InitialLoaderShader />
      <ScrollProgress />
      <CustomCursor />
      {children}
    </div>
  );
}

export { spaceGrotesk, inter, jetbrainsMono };

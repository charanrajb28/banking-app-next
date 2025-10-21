// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { ApolloProvider } from '@/lib/apollo-provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NeoBank - Modern Digital Banking',
  description: 'Complete banking solution with modern UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <ApolloProvider>
        {children}</ApolloProvider>
      </body>
    </html>
  );
}

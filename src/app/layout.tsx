import ModalProvider from "@/lib/providers/modal-provider";
import "./globals.css";

import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "sonner";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plura",
  description: "All in one solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            {children}
            <Toaster position="bottom-right" richColors />{" "}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

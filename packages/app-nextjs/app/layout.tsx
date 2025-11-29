import { Inter } from "next/font/google";
import Provider from "./provider/Provider";
import Header from "./components/ui/Header";
import Main from "./components/ui/Main";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>
          <Header />
          <Main>{children}</Main>
        </Provider>
      </body>
    </html>
  );
}

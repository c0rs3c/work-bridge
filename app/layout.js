import "./globals.css";

export const metadata = {
  title: "Work Bridge",
  description: "Labour supply and demand management portal"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

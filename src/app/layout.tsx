import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRANRAKSHA AI — Predict Danger. Connect Help. Save Lives.",
  description:
    "AI-powered Emergency Intelligence, Live GPS Tracking, Disaster Prediction and Rescue Coordination Platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"
        />
      </head>
      <body className="min-h-screen bg-navy text-foreground antialiased selection:bg-cobalt selection:text-white">
        {children}
      </body>
    </html>
  );
}

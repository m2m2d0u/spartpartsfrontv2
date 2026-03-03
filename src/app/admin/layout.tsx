import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Spare Parts Admin",
    default: "Spare Parts Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

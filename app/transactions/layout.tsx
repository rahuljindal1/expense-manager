import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Transactions',
    description: 'Transactions'
}

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datas Bugadas",
  description: "Pratique testes de datas, cálculos, formatos e timezone em um playground com bugs intencionais.",
};

export default function DatasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">{children}</div>;
}

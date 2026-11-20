import Sidebar from "../components/Sidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-[#E3DFD3]">{children}</main>
    </div>
  );
}

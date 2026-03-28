import { TravelSidebar } from "@/components/layout/travel-sidebar";

export default function TravelAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-8">
      <TravelSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

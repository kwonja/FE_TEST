import { WifiOff } from "lucide-react";

const OfflinePage = () => {
  return (
    <main className="grid min-h-dvh place-items-center bg-game-paper p-6 text-game-ink">
      <section className="w-full max-w-md rounded-md border-2 border-game-ink bg-white p-6 text-center shadow-[6px_6px_0_var(--game-ink)] sm:p-8">
        <WifiOff className="mx-auto size-10 text-game-coral" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-black">오프라인입니다</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
          아직 저장되지 않은 화면은 인터넷에 연결된 뒤 열어주세요.
        </p>
      </section>
    </main>
  );
};

export default OfflinePage;

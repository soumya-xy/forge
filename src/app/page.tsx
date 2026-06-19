import ForgeApp from '@/components/ForgeApp';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-[960px]">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-headline tracking-tight mb-2 text-primary font-bold">Forge</h1>
          <p className="text-muted-foreground italic font-body text-sm">Zero-to-One Builder</p>
        </header>
        <ForgeApp />
      </div>
    </main>
  );
}
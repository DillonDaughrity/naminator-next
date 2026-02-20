import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import NameForm from "@/components/NameForm";

export default async function Home() {
  const session = await auth();

  // Fetch user's previous combinations (server-side)
  const combinationSets = await prisma.nameCombinationSet.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      results: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize for client component (dates -> strings)
  const serializedHistory = combinationSets.map((set) => ({
    id: set.id,
    name1: set.name1,
    name2: set.name2,
    createdAt: set.createdAt.toISOString(),
    results: set.results.map((r) => ({
      id: r.id,
      name: r.name,
      goodness: r.goodness,
    })),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <p className="text-indigo-300 text-lg">
            Enter two names below and let AI create unique combinations. ✨
          </p>
        </div>

        <NameForm initialHistory={serializedHistory} />
      </main>
    </div>
  );
}

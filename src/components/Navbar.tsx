import { auth, signOut } from "@/auth";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
          🤖 The Naminator
        </h1>

        {/* User Info + Sign Out */}
        {session?.user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-gray-300 text-sm hidden sm:inline">
                {session.user.name}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-gray-400 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

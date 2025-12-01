import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-blue-700 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </main>
  );
}

export default function Loading() {
  return (
    <div
        aria-hidden="true"
        className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[9999] pointer-events-none"
      >
     <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

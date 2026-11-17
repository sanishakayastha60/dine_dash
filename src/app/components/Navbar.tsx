import Link from "next/link";
export default function Navbar() {
  return (
    <div className="w-full flex justify-between px-8 py-4 z-50">
      <div className="py-2">dine_dash</div>
      <div className="flex gap-6 bg-[#f0efed] rounded-full px-6 py-2">
        <Link href="/" className="bg-white px-2 rounded-full">
          Home
        </Link>
        <Link href="/">Explore Restaurant</Link>
        <Link href="/">Food Categories</Link>
        <Link href="/">My Orders</Link>
        <Link href="/">How It Works</Link>
      </div>
      <div className="py-2 flex gap-2">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </div>
  );
}

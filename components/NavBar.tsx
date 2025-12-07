import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="bg-black bg-opacity-60 text-white p-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src="images/logo.png" alt="AOT Logo" className="h-10 w-10" />
          <span className="font-bold">Scout Corps</span>
        </div>
        <div className="space-x-4">
          <Link href="/dashboard"><a>Dashboard</a></Link>
          <Link href="/shop"><a>Shop</a></Link>
          <Link href="/leaderboard"><a>Leaderboard</a></Link>
          <Link href="/profile"><a>Profile</a></Link>
          <Link href="/login"><a className="ml-3 bg-red-700 px-3 py-1 rounded">Login</a></Link>
        </div>
      </div>
    </nav>
  );
}

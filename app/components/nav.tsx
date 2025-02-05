import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="border-b border-red-800/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              Map<span className="text-red-500">X</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/map" className="text-gray-300 hover:text-white transition-colors">
              Open Map
            </Link>
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#safety" className="text-gray-300 hover:text-white transition-colors">
              Safety
            </Link>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}


"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Calculator, LayoutDashboard } from "lucide-react"

export function NavMenu() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link href="/" className="flex items-center justify-center">
        <Calculator className="h-8 w-8 text-green-600" />
        <span className="ml-2 text-xl font-bold">MacroTrack</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {session ? (
          <>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-green-600 transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Welcome, <span className="text-green-600 font-bold">{session.user?.name}</span>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <>
            <Link href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-green-600 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  )
} 
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// Log the secret to verify it's being read (remove in production)
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'exists' : 'missing')

// In-memory user store - this is just for demonstration
// In a real app, you would use a database
const users: { id: string; name: string; email: string; password: string }[] = []

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please define NEXTAUTH_SECRET environment variable")
}

const authOptions: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/dashboard", // Redirect new users to dashboard
    signOut: "/" // Redirect to landing page after logout
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // If the URL is for sign out, redirect to landing page
      if (url.includes("signout")) {
        return baseUrl
      }
      // Otherwise redirect to dashboard after sign in
      return `${baseUrl}/dashboard`
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "example@example.com"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = users.find(user => user.email === credentials.email)
        
        if (!user || user.password !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    })
  ]
}

export { authOptions }

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)

// Helper function to register a new user
export async function registerUser(name: string, email: string, password: string) {
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    password
  }

  users.push(newUser)
  return { id: newUser.id, name: newUser.name, email: newUser.email }
} 
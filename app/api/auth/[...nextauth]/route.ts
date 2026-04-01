import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validUser = process.env.PORTAL_USERNAME || 'admin'
        const validPass = process.env.PORTAL_PASSWORD || 'BlackTop2026!'
        if (
          credentials?.username === validUser &&
          credentials?.password === validPass
        ) {
          return { id: '1', name: 'Admin', email: 'axiom@blacktopdigital.ai' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/portal',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

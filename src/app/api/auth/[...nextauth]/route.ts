import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? 'your-google-client-secret',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? 'your-facebook-client-id',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? 'your-facebook-client-secret',
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'your-secret-key-here',
})

export { handler as GET, handler as POST }

import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string | undefined;
      email: string | undefined;
      name: string | undefined;
      emailVerified: string | undefined;
    }
  }
}
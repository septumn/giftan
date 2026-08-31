import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
<<<<<<< HEAD
      id: string | undefined
      email: string | undefined
      name: string | undefined
      emailVerified: string | undefined
=======
      id: string | undefined;
      email: string | undefined;
      name: string | undefined;
      emailVerified: string | undefined;
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    }
  }
}
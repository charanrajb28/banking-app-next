// src/lib/apollo-server.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { supabase } from '@/lib/supabase';

export interface Context {
  user: any | null;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

export const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    const authHeader = req.headers['authorization'] || (Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : undefined);
    
    if (!authHeader) {
      return { user: null };
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return { user: null };
      }

      return { user };
    } catch (error) {
      console.error('Auth error:', error);
      return { user: null };
    }
  },
});

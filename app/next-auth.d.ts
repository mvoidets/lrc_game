// next-auth.d.ts

import NextAuth from "next-auth";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { AdapterUser as DefaultAdapterUser } from "@auth/core/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    };
  }

  interface User {
    id: string;
    username: string;
  }

  interface JWT {
    id: string;
    username: string;
  }
}

// declare module "@auth/core/adapters" {
//   export interface AdapterUser extends DefaultAdapterUser {
//     id: string;
//     username: string;
//   }
// }
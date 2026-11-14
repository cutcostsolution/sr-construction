import * as cookie from "cookie";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { findUserByEmail } from "./queries/users";
import { signSessionToken } from "./kimi/session";
import { getDb } from "./queries/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

function validatePassword(pw: string): string | null {
  if (pw.length < 10) return "Password must be at least 10 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must contain at least one special character.";
  return null;
}

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  login: publicQuery
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      const token = await signSessionToken({ userId: user.id });
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true, name: user.name, role: user.role };
    }),
  changePassword: authedQuery
    .input(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      if (!user.passwordHash) throw new TRPCError({ code: "FORBIDDEN", message: "Password change not available for this account." });
      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
      const err = validatePassword(input.newPassword);
      if (err) throw new TRPCError({ code: "BAD_REQUEST", message: err });
      const hash = await bcrypt.hash(input.newPassword, 12);
      await getDb().update(users).set({ passwordHash: hash }).where(eq(users.id, user.id));
      return { success: true };
    }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});

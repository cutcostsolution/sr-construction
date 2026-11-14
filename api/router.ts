import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { publicRouter, adminRouter } from "./sr-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  public: publicRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

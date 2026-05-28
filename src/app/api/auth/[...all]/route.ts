import { toNextJsHandler } from "better-auth/next-js";
import { authInstance } from "@/server/auth";

export const { GET, POST } = toNextJsHandler(authInstance);

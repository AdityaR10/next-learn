import { createRouteHandler } from "uploadthing/next";
export const runtime = "nodejs";
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter, 
});
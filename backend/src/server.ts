import { app, config } from "@/app";
import { prisma } from "@/lib/prisma";

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at http://localhost:${config.port}`);
});

const gracefulShutdown = () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

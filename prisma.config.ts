import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Paste your exact Neon URL here, making sure your real password is included
    url: "postgresql://neondb_owner:npg_U6Bpc1JEDWsT@ep-lucky-sky-aquk3u9x.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
  },
});
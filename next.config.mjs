export default {
  output: 'standalone',
  assetPrefix:
      process.env.NODE_ENV === 'production' && !process.env.VERCEL
          ? 'https://cdn.zzfzzf.com/json2ts'
          : '/',
  reactStrictMode: true,
};

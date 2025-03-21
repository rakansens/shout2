import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const configDir = path.resolve(rootDir, 'config');

// 環境変数の読み込み
const envPath = path.resolve(configDir, '.env.local');
const envConfig = fs.existsSync(envPath)
  ? Object.fromEntries(
      fs
        .readFileSync(envPath, 'utf8')
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .filter(line => !line.startsWith('NODE_ENV=')) // NODE_ENVを除外
        .map(line => line.split('=').map(part => part.trim()))
    )
  : {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shout2/ui', '@shout2/api'],
  env: {
    ...envConfig,
  },
};

export default nextConfig;

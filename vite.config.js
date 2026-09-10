var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Pagesはリポジトリ名がそのままURLパスになるため、
// Actions側で VITE_BASE をリポジトリ名に合わせて渡す（未指定時はローカル開発用に "/"）
export default defineConfig({
    base: (_a = process.env.VITE_BASE) !== null && _a !== void 0 ? _a : '/',
    plugins: [react()],
});

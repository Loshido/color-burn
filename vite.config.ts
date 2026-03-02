import type { UserConfig } from 'vite';

export default {
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: './',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: 'index.html',
                sw: 'src/sw/mod',
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    const noHashFiles = ["sw"];
                    if (noHashFiles.includes(chunkInfo.name)) {
                        return "[name].js";
                    }
                    return "chunks/[name]-[hash].js"
                },
            }
        },
    },
} satisfies UserConfig;
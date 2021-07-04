require('esbuild').build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'dist/main.js',
}).catch( () => process.exit(1) )
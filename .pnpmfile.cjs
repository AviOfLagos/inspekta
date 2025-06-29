// pnpm hooks for Vercel deployment compatibility
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow all packages to run their build scripts
      if (pkg.name === '@prisma/client' || 
          pkg.name === '@prisma/engines' ||
          pkg.name === 'prisma' ||
          pkg.name === 'esbuild' ||
          pkg.name === '@scarf/scarf' ||
          pkg.name === '@tree-sitter-grammars/tree-sitter-yaml' ||
          pkg.name === 'core-js-pure' ||
          pkg.name === 'tree-sitter' ||
          pkg.name === 'tree-sitter-json') {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};
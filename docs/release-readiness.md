# Release readiness

## Dependency lock

The committed lockfile currently resolves `esbuild` to `0.28.1`. It is a
transitive dependency selected by `tsx@4.23.0` and by `vitest@3.2.7` through
`vite@7.3.6`; this package has no direct `esbuild` dependency or version
override.

Release validation uses the repository's Node.js 20+ baseline and the full
`npm run ci` pipeline. Any future lockfile change that selects a different
`esbuild` version must be explained and validated in the corresponding pull
request.

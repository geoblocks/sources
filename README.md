# Geoblocks sources

## Publish a new version to npm

```bash
npm ci
npm test
```

then:
```bash
npm version patch
npm publish
git push --tags origin master
```

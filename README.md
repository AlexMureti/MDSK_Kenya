# MDSK Kenya Website

Static website for Men with Disabilities Society of Kenya.

## Local Preview

```powershell
node tools\serve-static.cjs . 4177 127.0.0.1
```

Open:

```text
http://127.0.0.1:4177/index.html
```

## Validate

```powershell
node tools\check-static-site.cjs
```

The checker validates HTML page links, hash targets, duplicate IDs, and local asset references.

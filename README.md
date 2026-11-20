# bazari.sh

The page that Bazarish links lead to: `https://bazari.sh/#<kind>?<query>`.

It reads the link from the fragment, which the browser never sends to the server,
shows what the link carries and hands it to the app as `bazarish://<kind>?<query>`.

`docs/` is static and needs no build: GitHub Pages serves it as it is.

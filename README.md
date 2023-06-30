# lndhubx proxy server

## Install

Clone the repository and then create a new `.env` file based on `.env-sample` file.

```
$ git clone https://github.com/diba-io/lndhubx-proxy-server.git
$ cd lndhubx-proxy-server
$ cp .env-sample .env
```

Please set the environment variables in the `.env` file to your needs.

## Database

This project needs as redis server to store users data.

## Compile and execute it:

```
# install dependencies
npm install

# run in dev mode on port 3000
npm run dev

# generate production build
npm run build

# run generated content in dist folder on port 3000
npm run start
```

## How to use it

First you need to set up a username and link it with a 20-byte hex-encoded xpubkh.

```
$ curl -d "username=alice&xpubkh=aabbccddeeffaabbccddeeffaabbccddeeffffff" -X POST http://localhost:3000/username
```

ln address related endpoints

- http://localhost:3000/.well-known/lnurlp/user01
- https://localhost:3000/api/pay/fjcalderon?amount=20000

Nostr related endpoint

- http://localhost:3000/.well-known/nostr.json?username=user01

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying

The Dockerfile is designed to make deploying this app easy as a standalone server.

You can simply run

```
docker build -t my-app .
```

and then

```
docker run -it --rm -p "3456:3000" my-app
```

You can replace 3456 with any port you like and access the website at `http://localhost:3456`.
# `coordinape-playground`

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `pages/index.tsx`. The page
auto-updates as you edit the file.

## CSV Results

This project includes `data.csv` which is the result of our Coordinape epoch in
a `csv` format.

### Generating a CSV results file

This project includes a `csv` script which fetches the Coordinape epoch results
and writes them to a file in a `csv` format. Note that you need to provide your
Coordinape auth token (the one in the example won't work).

```sh
# writes results to data.csv
COORDINAPE_TOKEN="Bearer 12345|ABCDEFGHIJKLMNOP" yarn csv

# writes results to output.csv
COORDINAPE_TOKEN="Bearer 12345|ABCDEFGHIJKLMNOP" yarn csv output.csv
```

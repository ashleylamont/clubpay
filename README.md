# ClubPay

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
[![Join Discord](https://img.shields.io/discord/476382037620555776?label=discord)](https://cssa.club/discord)
[![remix](https://img.shields.io/badge/remix-v2.0.0-blue)](https://remix.run/)
[![Prisma](https://img.shields.io/badge/prisma-v5.3.1-blue)](https://www.prisma.io/)

⚠️⚠️⚠️ **ClubPay is still in the early stages of development and not ready for use. If you're interested in getting involved in the development, join us on our [Discord](https://cssa.club/discord).** ⚠️⚠️⚠️

ClubPay is a remix indie stack application designed to replace QPay, allowing clubs to manage and sell memberships via an open-source app.

## Table of Contents
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [License](#license)

## Getting Started

To start working on ClubPay, clone the existing repository and follow the development steps below.

## Development

1. Make sure you have installed the necessary dependencies:

```sh
npx remix init
```

2. Perform the initial setup using the setup script:

```sh
npm run setup
```
You may also need to run the following? Idk, it helps me sometimes :/
```sh
npx prisma migrate dev --name init
```

3. Create .env file following the .env.example file

4. Start the development server:

```sh
npm run dev
```

The application should now be accessible at `http://localhost:3000`.

## Deployment

ClubPay includes a set of preconfigured GitHub Actions for deploying to production and staging environments. Before deploying, follow the instructions in the [Deployment section](https://github.com/remix-run/indie-stack#deployment) in the Remix Indie Stack documentation to set up Fly Apps, GitHub repositories, and secret keys.

## Testing

ClubPay (in theory) uses several testing approaches, including:
None of these are really configured as yet, but they will be eventually when things are more nailed down.
- End-to-End testing with [Cypress](https://cypress.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Static types with [TypeScript](https://typescriptlang.org)
- Linting with [ESLint](https://eslint.org)
- Code formatting with [Prettier](https://prettier.io)

For detailed information on setting up and using these tools, refer to the [Testing section](https://github.com/remix-run/indie-stack#testing) in the Remix Indie Stack documentation.

## License

ClubPay is licensed under the [MIT license](LICENSE).

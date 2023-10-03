# Sharuco

Share your code. Manage Form & Link.

## Features

- Create snippets of your code and share / Generate images from your snippets and share on Social Network. ( https://sharuco.lndev.me/explore )
- Create forms easily in minutes and collect all your information. ( https://sharuco.lndev.me/forms )
- Store all the links that are useful to you and with possibilities to make everyone discover them. ( https://sharuco.lndev.me/links )

## Requirements

- Node (>=18.18.0 recommended) + npm
- docker + docker-compose
- make (for Makefile targets)

## How to Install

```bash
# clone the repository and cd into it:
git clone https://github.com/ln-dev7/sharuco && cd sharuco

# Tips : make help to see all make target

## --- WITH DOCKER ---
# build and up the whole stack and start it with one command:
# note, all env are available in the example
make docker-build-up

# to build the app container only:
make docker-build

# to run the app container:
make docker-run

## --- NO DOCKER ---
# copy the .env.example to .env and fill all env variables
cp .env.example .env

#   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API Key.
#   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
#   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
#   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket.
#   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID.
#   - `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase App ID.
#   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase Measurement ID.

# Install dependencies:
make install

# build and start
make build && make start

# or on dev mode
make dev
```

## Usage

The application is accessible at http://localhost:3000/.

## Contributing

Contributions are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a branch for your contribution with `git checkout -b my_new_feature`.
3. Make your changes.
4. Submit a pull request on master branch.

## License

This project is licensed under the MIT License.

## Credits

1. Frontend: [Next.js](https://nextjs.org/)
2. DataBase / Auth: [Firebase](https://firebase.google.com/)
3. Hosting: [Vercel](https://vercel.com/)
4. UI : [UI Shadcn](https://ui.shadcn.com/) ( Tailwind CSS + Radix UI )
5. Tools: [React Query](https://tanstack.com/query/v3/), [React Hook Form](https://react-hook-form.com/)

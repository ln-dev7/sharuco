# Sharuco

Share your code. Manage Form & Link.

## Features

- Create snippets of your code and share / Generate images from your snippets and share on Social Network. ( https://sharuco.lndev.me/explore )
- Create forms easily in minutes and collect all your information. ( https://sharuco.lndev.me/forms )
- Store all the links that are useful to you and with possibilities to make everyone discover them. ( https://sharuco.lndev.me/links )

## Requirements

- Node (>=18.18.0 recommended) + pnpm

## How to Install

```bash
# clone the repository and cd into it:
git clone https://github.com/ln-dev7/sharuco && cd sharuco

# copy the .env.example to .env and fill all env variables
cp .env.example .env

#   - `NEXT_PUBLIC_FIREBASE_API_KEY` : Firebase API Key
#   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` : Firebase Auth Domain
#   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` : Firebase Project ID
#   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` : Firebase Storage Bucket
#   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` : Firebase Messaging Sender ID
#   - `NEXT_PUBLIC_FIREBASE_APP_ID` : Firebase App ID
#   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` : Firebase Measurement ID
#   - `NEXT_PUBLIC_NOTCH_PAY_API_URL` : Notch Pay API URL
#   - `NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY` : Notch Pay Public Key
#   - `NEXT_PUBLIC_NOTCH_PAY_PRIVATE_KEY` : Notch Pay Private Key
#   - `NEXT_PUBLIC_NOTCH_PAY_PUBLIC_KEY_TEST` : Notch Pay Public Key Test
#   - `NEXT_PUBLIC_ALGOLIA_APP_ID` : Algolia App ID
#   - `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` : Algolia Search Key
#   - `NEXT_PUBLIC_ALGOLIA_ADMIN_KEY` : Algolia Admin Key
#   - `NEXT_PUBLIC_ALGOLIA_USAGE_KEY` : Algolia Usage Key
#   - `NEXT_PUBLIC_LINK_PREVIEW_KEY` : Link Preview Key
#   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` : Recaptcha Site Key
#   - `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` : Recaptcha Secret Key

# Install dependencies:
pnpm install

# build and start
pnpm run build

# or on dev mode
pnpm run dev
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

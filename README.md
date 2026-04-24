# Sharuco

Share your code. Manage Form & Link.

## Features

- **Sharuco Image** — Turn any snippet into a shareable screenshot. Powered by Shiki with 14 built-in themes + 16 partner presets (Vercel, Supabase, Tailwind, and more), line numbers, window traffic lights, PNG download, clipboard copy and full keyboard shortcuts. Free, no sign-in required. ( https://sharuco.lndev.me/image )
- **Sharuco Code** — Create snippets of your code and share them / generate images from your snippets and share them on social networks. ( https://sharuco.lndev.me/explore )
- **Popular Code** — Discover the most liked snippets shared by the community. ( https://sharuco.lndev.me/popular )
- **Sharuco Form** — Create forms easily in minutes, publish them in one click, collect all your responses in a dedicated area and manage everything (including collaborators) from a single screen. ( https://sharuco.lndev.me/forms )
- **Sharuco Link** — Store all the links that are useful to you, with automatic link previews, and make everyone discover them. ( https://sharuco.lndev.me/links )
- **User Profiles** — Every user gets a public profile page listing their shared snippets, forms and links. ( https://sharuco.lndev.me/user/[username] )
- **Dashboard** — Manage all your content (codes, forms, links) from a single place once signed in.
- **Search** — Full-text search across codes, users, forms and links powered by Algolia.
- **GitHub Auth** — One-click sign-in with GitHub via Firebase Authentication.
- **Dark / Light mode** — Theme switcher with system preference support.
- **Donation** — Support the project with a donation through Notch Pay. ( https://sharuco.lndev.me/donation )

## Requirements

Node (>=18.18.0 recommended) + npm (or pnpm)

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
npm install

# build and start
npm run build
npm run start

# or on dev mode (with Turbopack)
npm run dev
```

## Usage

The application is accessible at http://localhost:3000/.

## Contributing

Contributions are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a branch for your contribution with `git checkout -b my_new_feature`.
3. Make your changes.
4. Submit a pull request on the `master` branch.

## License

This project is licensed under the MIT License.

## Credits

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19
- **Database / Auth**: Firebase (Firestore + GitHub Auth)
- **Hosting & Analytics**: Vercel + Vercel Analytics
- **UI**: shadcn/ui (Tailwind CSS v4 + Radix UI) + Lucide icons
- **Code highlighting**: Shiki, highlight.js, Prism
- **Image export**: html-to-image, jsPDF
- **Search**: Algolia (react-instantsearch)
- **Forms**: React Hook Form + Yup
- **Data fetching / State**: TanStack React Query, Zustand
- **Sharing**: react-share
- **Payments**: Notch Pay (donations)

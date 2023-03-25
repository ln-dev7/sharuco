# sharuco

Share your code with everyone.

## Installation

To install the application, follow these steps:

1. Clone the repository with `git clone https://github.com/ln-dev7/sharuco`.
2. Install the dependencies with `npm install`.
3. Create a Firebase project on the Firebase console and enable Firestore and Firebase Github Auth.
4. Set up Firebase environment variables in a `.env` file. The required variables.
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API Key.
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket.
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID.
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase App ID.
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase Measurement ID.
5. Start the development server with `npm run dev`.

## Usage

The application is accessible at http://localhost:3000/.

## Contributing

Contributions are welcome! To contribute, follow these steps:

1. Fork the repository.
2. Create a branch for your contribution with `git checkout -b my_new_feature`.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.

## Credits

1. Frontend: [Next.js](https://nextjs.org/)
2. DataBase / Auth: [Firebase](https://firebase.google.com/)
3. Hosting: [Vercel](https://vercel.com/)
4. UI : [UI Shadcn](https://ui.shadcn.com/) ( Tailwind CSS + Radix UI )
5. Tools: [React Query](https://tanstack.com/query/v3/), [React Hook Form](https://react-hook-form.com/)

# Common Goods

A single-seller storefront built with Next.js, PostgreSQL, Prisma, Auth.js, Cloudinary, and Stripe Checkout.

## Run the storefront

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Without a database, the home page is shown in preview mode; account access, product management, and orders require PostgreSQL.

## Connect a PostgreSQL database (Neon)

1. Create a free project at <https://neon.tech/> and open its **Connect** dialog.
2. Select the project database and role, then copy the PostgreSQL connection string. Use the direct connection string (not the pooled endpoint) for local development and Prisma schema setup.
3. In the repository root, create `.env.local` (this file is git-ignored):

   ```env
   DATABASE_URL="paste-your-neon-postgresql-connection-string-here"
   AUTH_SECRET="generate-a-unique-secret"
   AUTH_URL="http://localhost:3000"
   ```

   Generate a secret with `openssl rand -base64 32`. The development server has a local-only fallback secret, but use a unique `AUTH_SECRET` for production.

4. Create the database tables:

   ```bash
   npm run db:push
   ```

5. Seed the first administrator. Add these to `.env.local` using a real email and a unique password of at least 8 characters:

   ```env
   ADMIN_EMAIL="you@example.com"
   ADMIN_PASSWORD="choose-a-unique-password"
   ```

   Then run:

   ```bash
   npm run db:seed
   ```

   The seed command creates an administrator, or promotes the matching existing account. Remove `ADMIN_PASSWORD` from `.env.local` after seeding. Sign in at `/login`; the **Dashboard** link opens `/admin/dashboard`.

## Add and list products

The admin dashboard supports creating, editing, and deleting products. Product images are uploaded to Cloudinary. Add the following Cloudinary values to `.env.local` to enable image uploads:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Create a Cloudinary account at <https://cloudinary.com/> and find these values in its dashboard. Products added from the admin panel appear on the storefront at `/`.

## Enable payments

Add Stripe test credentials to `.env.local`:

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Configure a Stripe webhook endpoint at `http://localhost:3000/api/stripe/webhook` for local testing with the Stripe CLI, forwarding `checkout.session.completed` events. Order records are written only after the signed Stripe webhook confirms a paid Checkout session.

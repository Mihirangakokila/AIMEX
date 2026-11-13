# AIMEX

Portfolio site for AIMEX, a creative and digital agency. One Next.js application holds the public site, project pages, contact form, admin and database access.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` if it is not already there, and set a real admin password and `AUTH_SECRET`.
3. Start MongoDB, then `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

The local `.env.local` signs in with `admin@aimex.studio` / `aimex-admin`. Change both before this is public.

If MongoDB is not running, the public site still shows starter projects. Inquiries and saving projects need the database. From the admin dashboard, use **Import sample projects** once MongoDB is connected, then replace the images and copy with real work.

## Replace the work

In admin, edit a project and upload a thumbnail, hero image and gallery. JPG, PNG, WEBP, GIF and AVIF files under 4MB are stored in `public/uploads`. You can also paste an image URL. Leave the image fields empty to keep the built-in placeholder frames.

Social links, email and phone live in `lib/site.ts` and the `NEXT_PUBLIC_CONTACT_*` variables.

## Logo

A gold wordmark is drawn in `components/brand/Logo.tsx`. Swap that component if you have the final logo file.

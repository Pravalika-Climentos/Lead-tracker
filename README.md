# CRMS Lead Status Tracker

Separate, read-only organization lead tracker. It does **not** connect to MySQL. It receives a sanitized lead status view from the CRMS backend through a revocable organization token.

## Local setup

1. Start the CRMS backend on `http://localhost:8080`.
2. On Windows, run `./start-tracker.cmd`. If Node.js/npm is installed globally, `npm start` also works.
3. Sign in to CRMS as Admin and open **Leads → Organization tracker**.
4. Generate the organization link and open it.

The local tracker runs at `http://localhost:3000`. Its API address is configured in `config.js`.

## Security behavior

- One link shows all organization leads.
- No CRM sign-in or role is required for visitors who possess the link.
- The token stays in the URL fragment and is sent only in the `X-Lead-Tracking-Token` request header.
- The raw token is never stored in the CRM database; only its SHA-256 hash is stored.
- The public API omits contact details, values, notes and internal database IDs. It exposes the assignee display name for tracking and filtering.
- Admin can regenerate or disable the link immediately.
- Search engines are instructed not to index the portal.

## Later deployment

For deployment, set the tracker API URL in `config.js`, set `LEAD_TRACKER_BASE_URL` and `LEAD_TRACKING_ALLOWED_ORIGINS` on the CRMS backend, and deploy this folder as a separate service. Those are deployment steps after the local implementation.

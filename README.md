# CRMS Lead Status Tracker

A separate, read-only web portal for viewing the status of all CRM leads through one organization-level link.

The tracker does not connect directly to MySQL. It requests sanitized lead information from the existing Java Spring Boot CRMS backend.

## Features

- One organization link for all leads
- Total, New, In Progress and Converted summaries
- Search by lead name or public reference
- Filter by assignee and status
- Lead source and last-updated information
- Read-only lead status timeline
- Responsive desktop and mobile layout
- Revocable organization access token
- No edit, delete or status-update permissions
- No CRM login required for visitors who possess the link

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js static HTTP server
- Java Spring Boot REST API in the main CRMS project
- MySQL through the CRMS backend only

## Prerequisites

Before using the tracker, ensure that you have Git, Node.js 18 or newer, the CRMS Java backend, its configured MySQL database, and an Admin account in CRMS.

Verify Node.js:

```powershell
node --version
npm --version
```

## Clone the project

```powershell
git clone https://github.com/Pravalika-Climentos/Lead-tracker.git
cd Lead-tracker
```

This project does not currently use third-party npm packages, so `npm install` is not required.

## Configure the backend address

Open `config.js`:

```javascript
window.LEAD_TRACKER_CONFIG = {
  apiBaseUrl: "http://localhost:8080"
};
```

For production, replace it with the deployed CRMS backend URL:

```javascript
window.LEAD_TRACKER_CONFIG = {
  apiBaseUrl: "https://your-crms-backend.up.railway.app"
};
```

Do not add database credentials, Gmail credentials or access tokens to this file.

## Start locally

With Node.js installed:

```powershell
npm start
```

On Windows, the included launcher can also be used:

```powershell
.\start-tracker.cmd
```

Open `http://localhost:3000`. Keep the terminal open while using the tracker. Press `Ctrl+C` to stop it.

## Start the CRMS backend

From the main Java CRMS project folder:

```powershell
.\mvnw.cmd spring-boot:run
```

If the Maven wrapper is unavailable:

```powershell
mvn spring-boot:run
```

Confirm the backend is healthy at `http://localhost:8080/actuator/health`.

The tracker cannot display lead data unless the CRMS backend is running.

## Generate and use the tracker link

1. Open the CRMS application at `http://localhost:8080`.
2. Sign in with an Admin account.
3. Open **Applications → Leads → Lead Workspace**.
4. Select **Organization tracker**.
5. Enter the organization name.
6. Optionally select an expiry date.
7. Select **Generate link**.
8. Copy or open the generated link.
9. Share the link only with authorized viewers.

Example:

```text
http://localhost:3000/#/organization/SECURE_TOKEN
```

The same link displays all organization leads until an Admin disables, regenerates or expires it.

## Information shown

The tracker displays lead name, public reference, assignee display name, status, source, last-updated time, and a sanitized status timeline.

It does not display email, phone, estimated value, private notes, internal database IDs, or CRM authentication information.

## What is the Reference column?

Reference is a stable, public-safe lead identifier such as:

```text
LD-A12B34C56D78
```

It lets the tracker open a lead without exposing its internal numeric database ID. It remains unchanged when the lead is reassigned or its status changes.

## CRMS backend deployment configuration

Configure these variables on the deployed CRMS backend:

```ini
LEAD_TRACKER_BASE_URL=https://your-tracker-domain
LEAD_TRACKING_ALLOWED_ORIGINS=https://your-tracker-domain
```

`LEAD_TRACKER_BASE_URL` controls the generated tracker link. `LEAD_TRACKING_ALLOWED_ORIGINS` permits the tracker domain to call the Java backend from the browser.

Restart or redeploy the backend after changing these values.

## Public API endpoints

```text
GET /api/public/lead-tracking/summary
GET /api/public/lead-tracking/assignees
GET /api/public/lead-tracking/leads
GET /api/public/lead-tracking/leads/{publicReference}
```

The organization token is sent through this header:

```http
X-Lead-Tracking-Token: secure-token
```

## Security

- The database stores only the SHA-256 hash of the organization token.
- The token stays in the browser URL fragment.
- Public responses are non-cacheable.
- Search engines are instructed not to index the tracker.
- Admin can disable the link immediately.
- Regenerating the link invalidates the previous link.
- Anyone possessing an active link can view sanitized data, so treat it as confidential.

## Troubleshooting

### `npm` is not recognized

Install Node.js LTS, reopen PowerShell, and run `node --version` and `npm --version` again.

### Port 3000 is already in use

The tracker may already be running. Open `http://localhost:3000`.

To use another port:

```powershell
$env:PORT=3001
npm start
```

Update `LEAD_TRACKER_BASE_URL` if the tracker port changes.

### Tracker opens but does not show data

Check that:

1. The Java backend is running on the URL in `config.js`.
2. The organization link contains the complete token.
3. The token is active and has not expired.
4. The browser console does not show a CORS error.
5. `LEAD_TRACKING_ALLOWED_ORIGINS` exactly matches the tracker domain.

Use `Ctrl+F5` after frontend changes to clear cached browser assets.

### Source or assignee shows `Unassigned`

Confirm that the lead has a source and Sales Executive assignment in CRMS, then refresh the tracker.

## Project structure

```text
lead-status-tracker/
├── index.html           Page structure
├── styles.css          Responsive styling
├── app.js              API calls and UI behavior
├── config.js           CRMS backend address
├── server.mjs          Static Node.js server
├── start-tracker.cmd   Windows launcher
├── package.json        Project metadata and start command
└── README.md           Setup and usage documentation
```

## Deployment note

Deploy this tracker as a separate web service, but keep the Java CRMS backend as the only service that accesses MySQL. Do not add a direct database connection to the tracker.

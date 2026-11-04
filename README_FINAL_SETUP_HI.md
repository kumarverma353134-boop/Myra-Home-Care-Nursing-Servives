# MYRA Home Care — Final Dashboard Update & Setup (Windows)

## What changed in this package

- Owner Dashboard: added a **Revenue & Growth** section using Recharts. It compares monthly booking counts with verified earnings for the latest six calendar months and shows month-over-month growth.
- Manager Dashboard: expanded **Staff Management** with searchable staff directory, verification filter, staff-linked approved-review averages, a Monday–Sunday weekly shift calendar, shift assignment with start/end times, overlap prevention, shift removal, and a radial distribution of staff performance rating bands.
- Staff Dashboard: assigned shifts now show the scheduled time and allow staff to check in and mark a shift complete. These status changes are stored and appear in the Manager weekly calendar.
- Storage: added schedule deletion and same-browser-tab synchronization listeners.

## Important limitations — read before launch

This project currently stores its data in the browser's `localStorage`. It is suitable for a local demo or a single browser profile. It does **not** provide secure multi-device synchronization between a manager's phone and a staff member's phone. A `storage` event only synchronizes other tabs/windows on the same browser origin and device.

Before using real patient information or running this as a live healthcare business, connect a real shared backend (for example Supabase or Firebase), add server-side authentication and role-based access rules, and protect patient data. The current demo role switcher/local storage is not production-grade authentication or access control. Do not enter real patient medical details into this demo.

The performance chart uses **approved customer reviews linked through booking assignments**. If no staff-linked approved reviews exist, it displays an empty-state message instead of inventing scores. Revenue counts only bookings whose payment status is `verified_paid`.

## Windows setup (step by step)

1. Download and install **Node.js LTS** from https://nodejs.org/ (use Node 22 LTS; Vite 8 requires a recent Node version).
2. Extract `MYRA_HOMECARE_FINAL_DASHBOARD.zip` to a simple folder, for example `D:\MYRA_HOMECARE_FINAL`.
3. Open that extracted folder in VS Code.
4. In VS Code choose **Terminal → New Terminal**.
5. Confirm the terminal is in the folder containing `package.json`. Run:

   ```bash
   node -v
   npm -v
   ```

6. Install dependencies:

   ```bash
   npm install
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open the local URL shown in the terminal. The default Vite URL is `http://localhost:3000`.
9. Use the role switcher at the top to preview Website, Customer, Manager, Staff, and Owner screens. Test with demo data only.
10. To create a production build:

    ```bash
    npm run build
    ```

    The deployable static output is created in the `dist` folder.

11. To preview that build locally:

    ```bash
    npm run preview
    ```

## Test checklist

- Manager → Staff Management → assign a shift to a verified, active staff member.
- Check the week containing the selected date; confirm the new shift shows the correct date and time.
- Switch to the same staff profile in the same browser and open Duty Schedule.
- Press **Check in**, then **Complete shift**; return to Manager and confirm the status changes.
- Try assigning an overlapping time slot to the same staff member; it should be rejected.
- Owner → Revenue Analytics → Revenue & Growth; confirm the chart uses booking/payment data in the browser.
- Manager → Staff Management → performance ratings; confirm only approved reviews linked to staff bookings are included.

## Troubleshooting

- If `npm install` fails, check internet access and run `npm install` again from the folder that contains `package.json`.
- If port 3000 is busy, stop the other process or change the port in `package.json`'s `dev` script.
- If the browser shows an old screen, stop the dev server with `Ctrl + C`, restart `npm run dev`, and hard-refresh the browser with `Ctrl + Shift + R`.
- Do not delete browser site data unless you have exported/backed up the demo data; localStorage data may be cleared.

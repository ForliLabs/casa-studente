# UX Audit — CasaStudente

## Scope
Reviewed all routes under `src/app` and all shared components under `src/components`. Findings are grouped into the systemic issues that affect the whole product and the key workflows (auth, onboarding, listings, messaging, dashboard, reviews, notifications, offline, and footer destinations).

## Findings

### Critical

1. **No route-level loading or error recovery across the app**  
   - Affected: all major route groups (`/`, `/auth`, `/dashboard`, `/listings`, `/notifications`, `/community`, `/roommates`, `/reviews`, `/offline`, etc.)  
   - Impact: users get blank waits or abrupt crashes instead of skeletons and recovery actions.

2. **Contact form gives false success feedback**  
   - Affected: `src/components/contact-form.tsx`, listing detail pages  
   - Impact: users believe they contacted a landlord, but no message is created and no follow-up path exists.

3. **Footer links are dead ends**  
   - Affected: `src/components/footer.tsx`  
   - Impact: `/privacy`, `/terms`, and `/contact` are linked globally but do not exist.

4. **Dashboard navigation breaks down on mobile and is hard to scan on desktop**  
   - Affected: `src/components/dashboard.tsx`, `src/app/dashboard/layout.tsx`  
   - Impact: mobile users lose navigation entirely; desktop users face an ungrouped, role-agnostic list of links.

### High-impact

5. **First-run experience does not guide new users into onboarding**  
   - Affected: auth actions and onboarding flow  
   - Impact: new accounts land in product areas without setup context, reducing activation.

6. **Listings browse flow has duplicated controls and weak feedback**  
   - Affected: `src/components/listings-browser.tsx`  
   - Impact: duplicate filter UIs create confusion, numeric fields accept invalid text, and zero-result searches show a blank grid instead of an empty state.

7. **Create-listing flow feels incomplete**  
   - Affected: `src/app/dashboard/listings/new/page.tsx`, `src/app/dashboard/listings/page.tsx`, `src/components/image-upload.tsx`  
   - Impact: landlords cannot add photos in the form, availability uses free text instead of a date input, and the dashboard listing management screen is disconnected from newly created listings.

8. **Interactive menus and overlays lack keyboard support and dismissal behavior**  
   - Affected: `navbar`, `user-menu`, `language-switcher`, `campus-selector`, `image-upload` lightbox  
   - Impact: menus stay open after outside clicks, Escape does not close them, and key ARIA state is missing.

9. **Forms need stronger validation and completion feedback**  
   - Affected: login, register, verify, contact, onboarding  
   - Impact: missing autocomplete/hints, document upload is text-only on verify, and successful actions rarely give toast/snackbar feedback.

10. **Messaging and roommate contact flows are clumsy on small screens**  
    - Affected: `src/components/messages-view.tsx`, `src/components/roommate-list.tsx`  
    - Impact: mobile users must scroll past the thread list to reach the conversation, and roommate CTA buttons do not lead anywhere meaningful.

11. **Accessibility and visual consistency regressions reduce trust**  
    - Affected: `review-list`, `roommate-list`, `layout`, `globals.css`, `hero`, `pricing`  
    - Impact: star ratings are not semantic, review sub-ratings collapse on mobile, the configured Geist font is overridden globally, and some primary CTAs still use raw anchors instead of Next navigation.

## Severity Summary
- **Critical:** 4
- **High-impact:** 7
- **Polish:** addressed opportunistically while fixing the items above (toast/PWA overlap, focus styles, consistent page feedback shells)

## Implementation Plan
1. Add shared skeleton and route error UI for app, auth, dashboard, and listings.
2. Replace fake contact behavior with a real inquiry/message action plus toast feedback.
3. Add the missing footer destination pages.
4. Redesign dashboard navigation with grouping, role filtering, and mobile navigation.
5. Redirect incomplete users into onboarding and make onboarding steps actionable.
6. Simplify listings filters, add empty/reset states, and enforce numeric/date inputs.
7. Integrate image upload into listing creation and render dashboard listings from live store data.
8. Add keyboard/outside-click handling, ARIA state, and lightbox keyboard controls.
9. Improve form autofill, validation affordances, and success toasts.
10. Improve mobile messaging flow and roommate CTA destinations.
11. Fix accessible star ratings, responsive review grids, global typography, and Link usage.

# Changelog

All notable changes to CasaStudente will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Loading skeletons (`loading.tsx`) and error boundaries (`error.tsx`) for all route groups
- General contact form on the `/contact` page with server-action integration
- Mobile-responsive dashboard navigation with slide-out hamburger menu
- Reusable `SearchEmptyState` component for search result empty states
- Keyboard and focus management (Escape, click-outside) on all overlay components via `useDismissibleLayer`
- MIT LICENSE file
- `.editorconfig` for consistent editor settings
- This CHANGELOG file

### Fixed
- Contact page now includes an actionable contact form instead of static info only
- Dashboard mobile navigation upgraded from `<select>` dropdown to hamburger menu with full section links

## [0.1.0] - 2025-01-01

### Added
- Initial release with listing browser, dashboard, authentication, and messaging
- Natural language search for listings
- Neighborhood quiz and zone explorer
- Landlord onboarding wizard
- Tour request system
- Roommate matching
- Community forum
- Admin panel with analytics and moderation
- PWA support with offline page
- Multi-language support (IT/EN)
- Stripe payment integration
- AI assistant for listing descriptions

# UI/UX Design Prompt - RentMaster (Concise Version)

## Project Context
Design a modern, professional SaaS-style UI/UX for **RentMaster** - a room rental management system (React + TypeScript). Target users: property managers and landlords managing properties, tenants, contracts, invoices, and payments.

## Current State
- Basic sidebar + main content layout
- 7 pages: Login, Dashboard, Properties, Tenants, Contracts, Invoices, Payments
- Minimal styling, needs complete design overhaul
- No design system, icons, or modern components

## Design Requirements

### Style
- **Aesthetic**: Modern SaaS (like Stripe Dashboard, Linear, Notion)
- **Colors**: Professional blue primary (#3B82F6), semantic colors (success/warning/error), neutral grays
- **Typography**: Modern sans-serif (Inter/system), clear hierarchy
- **Spacing**: Consistent 4px/8px scale
- **Components**: Modern cards, tables, forms, modals with shadows and depth

### Key Pages to Design

1. **Login**: Centered form, brand, error states
2. **Dashboard**: 
   - Stat cards (6-8 metrics: rooms, contracts, revenue, outstanding)
   - Charts: revenue trends, occupancy, payment distribution
   - Recent activity feed
   - Quick actions
3. **Properties & Rooms**: Property cards grid, rooms table, modals
4. **Tenants**: Data table with search/filter, detail modals
5. **Contracts**: Table with status badges, comprehensive form modal
6. **Invoices**: Table with status badges, generate button, detail view
7. **Payments**: Table, payment form modal, filters

### Component Requirements

**Sidebar**: Icons, active states, user section, smooth transitions
**Header**: Page title, search bar, user menu, action buttons
**Tables**: Sortable columns, filters, pagination, hover effects, status badges, action buttons
**Forms/Modals**: Clean layout, validation UI, loading states, clear CTAs
**Cards**: Shadows, hover effects, clear hierarchy
**Buttons**: Primary/secondary/danger variants, loading states, icons
**Status Badges**: Color-coded pills (Active/Pending/Paid/Overdue/etc.)
**Empty States**: Friendly messages with illustrations
**Loading States**: Skeleton screens, spinners
**Error States**: Clear messages, retry actions

### UX Requirements
- Smooth animations/transitions
- Toast notifications for actions
- Confirmation dialogs for destructive actions
- Responsive (desktop-first, tablet/mobile adapted)
- Keyboard navigation
- WCAG 2.1 AA accessibility
- Search and filtering UI
- Data visualization (charts for revenue, occupancy)

### Design System Needed
- Color palette (exact hex codes)
- Typography scale
- Spacing system
- Component library specs
- Shadow/elevation system
- Icon recommendations (Heroicons/Feather)
- Chart library suggestions (Recharts/Chart.js)

### Deliverables
1. Complete design system documentation
2. All 7 pages fully designed (desktop + responsive)
3. Component specifications with all states
4. Implementation recommendations (CSS approach, libraries)
5. Color codes, typography, spacing values

### Success Criteria
Professional, modern, intuitive, consistent, accessible, performant. Should feel like a premium SaaS product that property managers will enjoy using daily.

---

**Design Philosophy**: Create a UI that feels professional, trustworthy, and efficient. Every interaction should be smooth, data should be easy to find, and actions should be clear and intuitive.




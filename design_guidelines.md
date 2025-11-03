# Conference Map Generator - Design Guidelines

## Design Approach

**Selected Approach:** Design System (Material Design-inspired)
**Justification:** This is a utility-focused productivity application requiring data-dense interfaces, complex workflows (drag-and-drop map editing), and professional presentation. The design prioritizes clarity, efficiency, and consistency over visual experimentation.

**Core Principles:**
- Functional clarity over decorative elements
- Consistent component patterns for learnability
- Clear visual hierarchy for data-heavy interfaces
- Responsive layouts supporting desktop-first workflows

---

## Typography

**Font Family:** Inter via Google Fonts CDN
- Primary: Inter (weights: 400, 500, 600, 700)
- Monospace: JetBrains Mono for data/IDs (weight: 400)

**Type Scale:**
- Display (Page Headers): text-3xl (30px), font-bold, leading-tight
- Heading 1 (Section Headers): text-2xl (24px), font-semibold, leading-snug
- Heading 2 (Card Titles): text-xl (20px), font-semibold, leading-snug
- Heading 3 (Subsections): text-lg (18px), font-medium, leading-normal
- Body Large: text-base (16px), font-normal, leading-relaxed
- Body: text-sm (14px), font-normal, leading-normal
- Small (Labels/Captions): text-xs (12px), font-medium, leading-tight
- Micro (Timestamps/IDs): text-xs (12px), font-normal

---

## Layout System

**Spacing Primitives (Tailwind Units):**
- Micro spacing: 2, 3 (8px, 12px) - for tight internal padding
- Standard spacing: 4, 6 (16px, 24px) - for component padding and gaps
- Section spacing: 8, 12, 16 (32px, 48px, 64px) - for page sections and card gaps

**Container Widths:**
- Dashboard content: max-w-7xl (1280px) centered
- Forms/modals: max-w-2xl (672px)
- Map editor: full-width with controlled sidebar (300px)

**Grid Patterns:**
- Admin cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Data tables: full-width with responsive scrolling
- Form layouts: single column, max-w-xl

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Height: h-16 (64px)
- Logo/branding on left
- Primary navigation links in center
- User menu/admin toggle on right
- Sticky positioning (sticky top-0)

**Tab Navigation:**
- Horizontal tabs with underline indicator
- gap-8 between tabs
- Active tab: font-semibold with accent underline (border-b-2)
- Hover: subtle background transition

### Cards
**Standard Card:**
- Border: border with subtle shadow (shadow-sm)
- Padding: p-6
- Rounded corners: rounded-lg
- Background: solid with subtle border

**Map Card (Dashboard):**
- Image preview at top (aspect-ratio-video)
- Content section with p-4
- Footer with metadata (text-xs, flex justify-between)

### Forms
**Input Fields:**
- Height: h-10 (40px) for text inputs
- Padding: px-3 py-2
- Border: border with focus ring (focus:ring-2)
- Rounded: rounded-md
- Label spacing: mb-2

**Buttons:**
- Primary: px-4 py-2, rounded-md, font-medium
- Secondary: outlined variant with border
- Icon buttons: p-2, rounded-md
- Small: px-3 py-1.5, text-sm

**Form Layout:**
- Label above input: flex flex-col gap-1.5
- Field spacing: space-y-4
- Button group: flex gap-3 justify-end

### Data Display
**Tables:**
- Row height: minimum py-3
- Cell padding: px-4 py-3
- Header: font-semibold, border-b-2
- Alternating rows: subtle background on even rows
- Hover state: subtle background change

**Lists:**
- Item padding: py-3 px-4
- Dividers: border-b between items
- Action buttons aligned right

### Modals/Dialogs
- Overlay: fixed inset-0 with backdrop blur
- Container: max-w-2xl, centered
- Padding: p-6
- Header with title and close button
- Footer with action buttons (flex justify-end gap-3)

### Map Editor Interface
**Layout Structure:**
- Sidebar: fixed left, w-80 (320px), h-full, overflow-y-auto
- Map canvas: flex-1, relative positioning for POI placement
- Toolbar: fixed top-right with editing controls

**POI Markers:**
- Size: w-8 h-8 (32px) for placement mode
- Icon container: rounded-full with category-based styling
- Label: text-xs, positioned below marker
- Draggable: cursor-move, hover scale (hover:scale-110)
- Active state: ring-2 with offset

**Map Canvas:**
- Container: relative with overflow handling
- Background image: object-contain, max-w-full
- Overlay grid: absolute positioning for POI placement
- Zoom controls: fixed bottom-right

### Dashboard Elements
**Stat Cards:**
- Compact layout: p-4
- Icon: w-10 h-10, rounded-lg
- Value: text-2xl font-bold
- Label: text-sm

**Action Buttons:**
- Icon + Text pattern
- gap-2 for icon and label
- Consistent sizing across card footers

---

## Interactive Patterns

**Drag and Drop:**
- Source items: cursor-grab, transition for smooth movement
- Drop zones: dashed border (border-dashed border-2) when active
- Dragging state: opacity-50 on original, shadow-lg on ghost
- Valid drop: visual feedback with border accent

**Search/Filter:**
- Search bar: full-width, h-10, with icon prefix
- Filter pills: inline-flex, gap-2, rounded-full, px-3 py-1

**Loading States:**
- Skeleton screens: animate-pulse on placeholder content
- Spinners: centered with text-sm message below
- Progress indicators: h-1 progress bar for uploads

---

## Responsive Behavior

**Breakpoint Strategy:**
- Mobile (base): Single column, stacked navigation
- Tablet (md: 768px): Two-column grids, side-by-side forms
- Desktop (lg: 1024px): Full multi-column layouts, persistent sidebars

**Mobile Adaptations:**
- Navigation: Hamburger menu
- Tables: Horizontal scroll with sticky first column
- Map editor: Full-screen with toggle sidebar
- Cards: Full-width stack

---

## Accessibility

**Focus Management:**
- Visible focus rings: ring-2 ring-offset-2
- Keyboard navigation: logical tab order
- Skip links: for main content

**Form Accessibility:**
- Label associations: htmlFor matching input IDs
- Error states: aria-invalid, error message with role="alert"
- Required fields: asterisk visual indicator + aria-required

**Interactive Elements:**
- Minimum touch target: 44x44px (h-11 w-11 or larger)
- Clear hover/active states for all clickable elements
- ARIA labels for icon-only buttons
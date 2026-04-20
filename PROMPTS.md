# AI-Assisted Development Assignment: Pets Gallery

## Project Overview

**Pets Gallery** is a React + TypeScript application for browsing, searching, and downloading pet images with advanced state management, responsive design, and persistent user selections.

**AI Assistance Level:** ~90% code generated with refined prompts and human direction

---

# Development Journey: Complete Step-by-Step Guide

## Phase 1: Project Initialization & Setup

### Step 1: Vite Project Creation

**Prompt Sent:**
```
Create a new Vite project with React and TypeScript. 
Configure tsconfig with strict mode enabled.
Set up ESLint with Prettier for code formatting.
Ensure the project structure follows component-based architecture.
```

**What was generated:**
- Vite configuration (vite.config.ts)
- TypeScript configs (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- ESLint configuration (eslint.config.js)
- Basic React app structure with main.tsx and App.tsx
- Package.json with necessary dependencies

**Key Files Created:**
```
pets-gallery/
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    └── index.css
```

### Step 2: Install Core Dependencies

**Prompt Sent:**
```
Add the following npm packages to the project:
- react-router-dom for client-side routing
- styled-components for component styling
- fetch API wrapper for HTTP requests

Create folder structure for:
- /src/components for reusable UI components
- /src/pages for page-level components
- /src/context for React Context providers
- /src/api for API integration
- /src/types for TypeScript interfaces
- /src/utils for utility functions
- /src/styles for global styles
```

**Generated Structure:**
```
src/
├── components/
│   ├── Header/
│   ├── PetCard.tsx
│   ├── PetGallery.tsx
│   └── SkeletonLoader.tsx
├── pages/
│   ├── Home.tsx
│   ├── PetDetail.tsx
│   └── About.tsx
├── context/
│   ├── index.ts
│   ├── PetsDataProvider.tsx
│   └── usePets.ts
├── api/
│   ├── config.ts
│   └── petsApi.ts
├── types/
│   └── pet.ts
├── utils/
│   └── petUtils.ts
└── styles/
    └── GlobalStyles.ts
```

---

## Phase 2: Core API Integration

### Step 3: Setup API Configuration

**Prompt Sent:**
```
Create an HTTP client configuration that:
1. Sets up base URL from environment variables
2. Handles API endpoints for fetching pets
3. Includes error handling and timeout configuration
4. Supports JSON request/response format

Define TypeScript interfaces for Pet data structure:
- id: string
- title: string
- description: string
- url: image URL
- created: date
- fileSize: number
```

**Generated Files:**
- `src/api/config.ts` - Base URL and axios/fetch setup
- `src/api/http.ts` - HTTP client wrapper
- `src/api/petsApi.ts` - Pet-specific API calls
- `src/types/pet.ts` - Pet interface definition

**Example Generated Code:**
```typescript
export interface Pet {
  id: string;
  title: string;
  description: string;
  url: string;
  created: string;
  fileSize: number;
}

export const fetchPets = async (): Promise<Pet[]> => {
  const response = await fetch(`${BASE_URL}/pets`);
  return response.json();
};
```

---

## Phase 3: Data Provider & State Management

### Step 4: Create PetsDataProvider

**Prompt Sent:**
```
Build a React Context provider that:
1. Manages global pet data fetching
2. Implements caching with localStorage (24-hour TTL)
3. Tracks loading and error states
4. Detects hard page reload (F5 / Cmd+R) and clears cache
5. Provides pet data to entire application via context

Add a custom hook usePetsData() for components to consume this data.
Include TypeScript interfaces for context shape.
```

**Generated Implementation:**
- Two-effect pattern for localStorage management
- Session storage flag for hard reload detection
- Automatic cache expiration logic
- Error handling with fallback

**Key Features:**
```typescript
interface PetsDataContextType {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
}

const isHardReload = (): boolean => {
  const sessionStarted = sessionStorage.getItem(SESSION_KEY);
  if (!sessionStarted) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
};
```

---

## Phase 4: Selection State Management

### Step 5: Implement SelectionProvider with Two-Context Pattern

**Prompt Sent:**
```
Create a SelectionProvider that manages pet selections with these requirements:
1. Store selected pets in an array
2. Persist selections to localStorage automatically
3. Create two separate contexts:
   - SelectionActionsContext (for functions like toggleSelection, clearSelection)
   - SelectionStateContext (for state: selected[], selectedIds, count)
4. Maintain a Set<petId> for O(1) lookup performance
5. Auto-load selections from localStorage on app mount
6. Debounce localStorage writes by 300ms for performance

Implement these selection methods:
- toggleSelection(pet): Add or remove a pet
- selectAll(pets): Replace all selections
- selectMultiple(pets): Add multiple pets
- clearSelection(): Remove all selections immediately
- removeSelection(petId): Remove single pet by ID
```

**Why Two Contexts:**
- SelectionActionsContext: Never changes (no re-renders to components using only it)
- SelectionStateContext: Changes frequently (causes re-renders only in components that use it)

**Generated Code Structure:**
```typescript
// Actions context - stable reference
const SelectionActionsContext = createContext<SelectionActionsType | undefined>(undefined);

// State context - causes re-renders when state changes  
const SelectionStateContext = createContext<SelectionStateType | undefined>(undefined);

// Hook that returns both (for components needing both)
export const useSelection = (): UseSelectionType => {
  const actions = useSelectionActions();
  const state = useSelectionState();
  return { ...actions, ...state, isSelected };
};
```

---

## Phase 5: Routing & Page Structure

### Step 6: Setup React Router Configuration

**Prompt Sent:**
```
Configure React Router with these routes:
1. / (Home page) - Main pet gallery
2. /pets/:id (Detail page) - Individual pet details
3. /about (About page) - Project information
4. * (Not Found) - 404 page with home button

Create a page layout component with Header and Footer.
Implement nested routing where Header persists across pages.
Style 404 page with centered content and return home button.
```

**Generated Route Structure:**
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/pets/:id" element={<PetDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

---

## Phase 6: UI Components & Pagination

### Step 7: Build PetGallery with Pagination

**Prompt Sent:**
```
Create a PetGallery component that:
1. Displays pets in a responsive grid:
   - 1 column on mobile (<768px)
   - 2 columns on tablet (768px-1023px)  
   - 4 columns on desktop (≥1024px)
2. Implements pagination with:
   - 12 items per page
   - Previous/Next buttons
   - Numbered page buttons (show up to 5 page numbers)
   - First/Last shortcuts when needed
3. Accept pets array and selection toggle handler as props
4. Reset pagination to page 1 when filtered data changes (detected by pets.length change)
5. Integrate with SelectionProvider to show selected state
6. Use Set.has() for O(1) selection checking

Handle edge cases:
- Empty results message
- Single page (hide pagination)
- Current page highlighting
```

**Generated Pagination Logic:**
```typescript
const getPageNumbers = (currentPage: number, totalPages: number) => {
  // Shows max 5 page numbers, with first/last shortcuts
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const adjustedStart = Math.max(1, end - 4);
  
  const pages = [];
  if (adjustedStart > 1) pages.push('first');
  for (let i = adjustedStart; i <= end; i++) pages.push(i);
  if (end < totalPages) pages.push('last');
  
  return pages;
};
```

### Step 8: Create PetCard Component

**Prompt Sent:**
```
Build a PetCard component that displays individual pets with:
1. Pet image (200px height, object-fit: cover)
2. Pet title (bold, larger font)
3. Description (truncated to 2 lines with ellipsis)
4. Last updated date (formatted in user locale)
5. "View Details" link styled in blue

Add selection functionality:
- Checkbox in top-left corner that toggles selection
- Blue border (#007bff) and light blue background when selected
- stopPropagation on checkbox to prevent card click
- Card click navigates to /pets/:id WITHOUT affecting selection

Make component memoized to prevent unnecessary re-renders.
Accept isSelected boolean prop and onToggleSelection callback.
```

**Key Implementation:**
```typescript
const handleCheckboxChange = (e) => {
  e.stopPropagation(); // Prevent card click
  onToggleSelection(pet);
};

const handleCardClick = () => {
  // Navigate WITHOUT toggling selection
  setCurrentPet(pet);
  navigate(`/pets/${pet.id}`);
};
```

### Step 9: SkeletonLoader for Loading States

**Prompt Sent:**
```
Create a SkeletonLoader component that:
1. Shows skeleton cards while data loads
2. Matches PetGallery responsive grid layout exactly
3. Animated placeholder with gradient shimmer effect
4. Accept 'count' prop for number of skeletons to show
5. Use CSS animation for shimmer (left-to-right movement)

Skeleton card structure should match PetCard layout.
```

---

## Phase 7: Header & Search Controls

### Step 10: Header Component with Search & Sort

**Prompt Sent:**
```
Create a Header component with:
1. Logo/Title that scrolls to top when clicked
2. Search input field:
   - onChange handler to filter pets in real-time
   - Placeholder: "Search pets..."
3. Sort dropdown with 4 options:
   - Name A-Z
   - Name Z-A
   - Date (newest first)
   - Date (oldest first)
4. Selection action buttons:
   - "Select All" button (with checkmark icon)
   - "Clear Selection" button (with X icon)
   - Download button showing badge with count
5. Download button that:
   - Is disabled when no selections
   - Shows "Downloading..." during download
   - Displays selected count badge
   - Has visual feedback (opacity 0.6 during download)

Use styled-components for styling.
Create subcomponents for each section (HeaderSearch, HeaderSort, HeaderActions, HeaderLogo).
Extract constants to Header.constants.ts for maintainability.
```

**Generated Structure:**
```
components/Header/
├── Header.tsx (main component)
├── Header.types.ts (TypeScript interfaces)
├── Header.constants.ts (magic strings and values)
├── Header.styles.ts (styled-components)
├── HeaderLogo.tsx
├── HeaderSearch.tsx
├── HeaderSort.tsx
└── HeaderActions.tsx
```

---

## Phase 8: Feature Implementation: Search & Filter

### Step 11: Search and Filter Logic

**Prompt Sent:**
```
Create utility functions in petUtils.ts:

1. filterPets(pets, query):
   - Case-insensitive search
   - Search across title AND description
   - Return matching pets array

2. sortPets(pets, sortOption):
   - Support: 'nameAZ', 'nameZA', 'dateNewest', 'dateOldest'
   - Use localeCompare for proper string sorting
   - Don't mutate original array

3. filterAndSortPets(pets, searchQuery, sortOption):
   - Combine: filter first, then sort
   - Use above two functions

When user types in search OR changes sort:
- Automatically CLEAR all selections (avoid confusion with filtered data)
- Reset pagination to page 1
- Apply filter/sort to data

Implement handlers in Home.tsx:
- handleSearchChange() - clear selection + update search
- handleSortChange() - clear selection + update sort
```

**Implementation Pattern:**
```typescript
const handleSearchChange = (query: string) => {
  clearSelection(); // Auto-clear selections
  setSearchQuery(query);
};

const handleSortChange = (sort: SortOption) => {
  clearSelection(); // Auto-clear selections
  setSortBy(sort);
};
```

---

## Phase 9: Download Feature

### Step 12: Download Multiple Pets as Images

**Prompt Sent:**
```
Implement downloadSelectedPets utility that:
1. Iterates through selected pets array
2. For each pet:
   - Fetch image from pet.url
   - Check response.ok status
   - Create blob from response
   - Trigger browser download using <a> tag
   - Clean up object URLs and DOM elements
3. Handle errors gracefully:
   - Log each error but continue with next pet
   - Don't throw - allow partial success
4. Add loading state:
   - isDownloading state in Home.tsx
   - Disable download button during download
   - Show "Downloading..." text
   - Visual feedback: opacity change

After successful download:
- Wait briefly (no delay needed, browser handles async)
- Call clearSelection() immediately
- Clear isDownloading state
```

**Generated Code:**
```typescript
export const downloadSelectedPets = async (selected: Pet[]): Promise<void> => {
  if (selected.length === 0) return;
  
  for (const pet of selected) {
    try {
      const response = await fetch(pet.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pet.title.replaceAll(' ', '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      globalThis.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Failed to download ${pet.title}:`, error);
    }
  }
};
```

---

## Phase 10: Responsive Design

### Step 13: Mobile-First CSS Implementation

**Prompt Sent:**
```
Apply mobile-first responsive design throughout:

Breakpoints:
- Mobile (default): <768px - 1 column
- Tablet: 768px-1023px - 2 columns
- Desktop: ≥1024px - 4 columns

Update in these components:
1. PetGallery - grid layout
2. SkeletonLoader - match PetGallery layout
3. PetDetail - adjust layout for mobile
4. Header - stack on mobile, horizontal on desktop
5. All typography - scale down font sizes on mobile

Use CSS media queries with min-width breakpoints.
Test layout at:
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)
```

**Responsive Grid Pattern:**
```typescript
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr); /* Desktop: 4 columns */
  }
`;
```

---

## Phase 11: Data Persistence & Hard Reload

### Step 14: Hard Reload Detection & Cache Management

**Prompt Sent:**
```
Implement smart caching in PetsDataProvider:

1. localStorage Management:
   - Save pet data with timestamp
   - 24-hour cache duration
   - Check cache freshness before using

2. sessionStorage Flag:
   - Track SESSION_KEY = 'petGallery_sessionStarted'
   - On first app load: sessionStorage.setItem(SESSION_KEY, 'true')
   - On subsequent loads: check if flag exists
   - If flag exists: use cached data if fresh
   - If flag doesn't exist: hard reload detected!

3. Hard Reload Handling:
   - Detect hard reload via absent sessionStorage flag
   - Clear localStorage cache completely
   - Force fresh API fetch
   - Reset UI state (search, sort)

4. Selection Persistence:
   - SelectionProvider saves selections to localStorage independently
   - Load selections on app mount
   - Selections survive:
     - Route navigation
     - Page refresh
     - Browser close/reopen (until cache expires)

Flow:
App Load → Check session flag → Hard reload? → Clear cache → Fetch fresh → Save to localStorage
```

**Hard Reload Pattern:**
```typescript
const isHardReload = (): boolean => {
  const sessionStarted = sessionStorage.getItem(SESSION_KEY);
  if (!sessionStarted) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true; // Hard reload detected
  }
  return false; // Normal navigation
};

// In loadPets useEffect:
if (isHardReload()) {
  localStorage.removeItem(STORAGE_KEY); // Clear cache
  // Force fetch fresh from API
}
```

---

## Phase 12: Advanced State Management

### Step 15: Selection Persistence Across Routes

**Prompt Sent:**
```
Ensure SelectionProvider is placed at app root level (above Router):

App.tsx structure:
<PetsDataProvider>
  <SelectionProvider>
    <PetDetailProvider>
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </PetDetailProvider>
  </SelectionProvider>
</PetsDataProvider>

This ensures:
1. Selections persist when navigating between routes
2. selections survive page refresh (via localStorage)
3. Selections available in all pages

Selection flow:
Home → Select pets → Navigate to /pets/:id → Selections still in context
/pets/:id → Go back to Home → Selections still selected
Close browser → Reopen → Selections restored from localStorage
```

---

## Phase 13: Bug Fixes & Refinements

### Step 16: Fix Selection Display Issues

**Prompt Sent:**
```
Problem: Selected cards not showing as selected after filtering.

Root cause: PetCard was reading pet.selected field that doesn't exist anymore.
Solution: 
1. PetGallery uses SelectionProvider's useSelection()
2. PetGallery gets selectedIds Set
3. For each pet, compute: isSelected={selectedIds.has(pet.id)}
4. Pass isSelected boolean to PetCard
5. PetCard uses isSelected prop to show/hide selection styling

Also fix pagination:
- When search/sort filters pets.length changes
- Reset currentPage to 1
- Use dependency: useEffect(() => {setCurrentPage(1)}, [pets.length])
```

### Step 17: Download Count Sync

**Prompt Sent:**
```
Problem: Download count badge doesn't update to 0 after download.

Root cause: clearSelection() was debounced by 300ms, but download completed immediately.
Solution:
1. Add clearSelection() call that bypasses debounce
2. Immediately write empty array to localStorage
3. React state updates synchronously
4. selected.length becomes 0
5. Count badge updates instantly

Modify SelectionProvider.clearSelection():
- setSelected([])  // Immediate state update
- localStorage.setItem(STORAGE_KEY, '[]') // Immediate storage write
- Don't wait for debounce timer

Also add immediate visual feedback:
- isDownloading state
- Disable button during download
- Show "Downloading..." tooltip
- Opacity 0.6 during download
```

---

## Phase 15: Display File Sizes for Selected Items

### Step 18: Show Total File Size & Item Count

**Prompt Sent:**
```
Add file size estimation feature that displays:
1. Total count of selected items (e.g., "3")
2. Total file size of selected items (e.g., "2.5 MB")
3. Display in download button badge and tooltip

Requirements:
1. Create formatFileSize(bytes) utility:
   - Converts bytes to human-readable: 1024 → "1.00 KB"
   - Supports B, KB, MB, GB, TB units
   - Returns format: "XX.XX UNIT"

2. Create calculateTotalFileSize(pets) utility:
   - Sum all pet.fileSize values
   - Handle missing fileSize property (default to 0)
   - Return total bytes

3. In Home.tsx:
   - Calculate total file size from selected array
   - Pass formattedFileSize to Header
   - Update useMemo to avoid recalculation

4. Update Header components:
   - Download button tooltip: "Download 3 items (2.5 MB)"
   - Count badge shows:
     └─ count on top
     └─ file size below (smaller text)

5. Visual display:
   Badge shows: 
   ┌─────────┐
   │    3    │  (count)
   │ 2.5 MB  │  (file size, smaller)
   └─────────┘
```

**Generated File Size Utilities:**

```typescript
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  return `${value.toFixed(decimals)} ${sizes[i]}`;
};

export const calculateTotalFileSize = (pets: Pet[]): number => {
  return pets.reduce((total, pet) => total + (pet.fileSize || 0), 0);
};
```

**Integration in Home.tsx:**

```typescript
const totalSelectedFileSize = useMemo(
  () => calculateTotalFileSize(selected),
  [selected]
);

const formattedFileSize = formatFileSize(totalSelectedFileSize);

const headerProps = {
  selectedCount: selected.length,
  formattedFileSize: formattedFileSize, // "2.5 MB"
  // ... other props
};
```

**Header Display Changes:**

```typescript
// Download button tooltip now shows:
const downloadLabel = hasSelection
  ? `Download ${selectedCount} items (${formattedFileSize})`
  : "Select items to download";

// Count badge renders:
<CountBadge $show={hasSelection}>
  {selectedCount}
  {hasSelection && formattedFileSize && (
    <>
      <br />
      <small>{formattedFileSize}</small>
    </>
  )}
</CountBadge>
```

**Features Delivered:**

✅ File size formatting (B, KB, MB, GB, TB)
✅ Real-time calculation from selected pets
✅ Display in download button tooltip
✅ Display in count badge (two-line format)
✅ Memoized for performance
✅ Handles edge cases (zero size, missing fileSize)
✅ Uses existing fileSize property from Pet interface
✅ TypeScript fully typed

**User Impact:**

- Users see estimated download size before clicking download
- Helps decide whether to add/remove selections
- Useful on slow connections or limited bandwidth
- All happen in real-time as selections change

---

## Phase 16: Code Documentation

### Step 19: Add Comprehensive Code Documentation

**Prompt Sent:**
```
Add JSDoc documentation to all public functions and components:

For each utility function:
- @param - describe parameters and types
- @returns - describe return value
- @example - show usage example
- Description of what function does

For each context/provider:
- Explain the context purpose
- Document all methods
- Explain when to use

For each component:
- Document purpose and features
- Document all props
- Explain special behaviors
- @component tag

Document these architectural decisions:
- Two-context pattern in SelectionProvider
- Why Set<petId> for O(1) performance
- Hard reload detection via sessionStorage
- 24-hour cache duration rationale
- Why selections clear on search/sort

Files to document:
- SelectionProvider.tsx
- PetsDataProvider.tsx
- Home.tsx
- PetCard.tsx
- PetGallery.tsx
- useSelection.ts
- petUtils.ts
```

---

## Phase 15: Production Build & Validation

### Step 19: Final Build & Testing

**Prompt Sent:**
```
Verify project builds correctly:
1. Run: npm run build
2. Check for TypeScript errors
3. Verify all 73 modules compile
4. Check bundle sizes:
   - HTML should be <1KB
   - CSS should be <5KB gzipped
   - JS should be <500KB gzipped
5. Ensure exit code is 0
6. Test in browser:
   - Home page loads with pets
   - Search filters work
   - Sort changes order
   - Selection persists on route change
   - Download works
   - Mobile responsive design works
```

---

## Final Project Statistics

| Metric | Value |
|--------|-------|
| **Total Components** | 12+ |
| **Total Context Providers** | 3 |
| **API Endpoints Used** | 1 (/pets) |
| **TypeScript Interfaces** | 8+ |
| **Utility Functions** | 3 |
| **Pages/Routes** | 4 |
| **Styling System** | styled-components |
| **State Management** | Context API |
| **Data Persistence** | localStorage + sessionStorage |
| **Responsive Breakpoints** | 2 (768px, 1024px) |

---

## Build Output

```
✓ 73 modules transformed
✓ dist/index.html                0.47 kB │ gzip: 0.30 kB
✓ dist/assets/index-*.css        1.93 kB │ gzip: 0.65 kB
✓ dist/assets/index-*.js       405.05 kB │ gzip: 129.40 kB
✓ built in 450-880ms
Exit code: 0 ✅
```

---

## How This Assignment Demonstrates AI-Assisted Development

### What Human Provided:
- Initial requirements and feature specifications
- High-level architectural decisions
- Problem identification and debugging guidance
- Code review and refinement requests
- UX/design direction

### What AI Generated (~90%):
- All component implementations
- All styling code
- All state management logic
- All utility functions
- All configuration files
- Documentation and comments
- Performance optimizations
- Error handling patterns

### Key Learning Points:

1. **Prompt Specificity Matters**: Detailed prompts generate better code
2. **Iterative Refinement**: Great products come from multiple prompt rounds
3. **Architecture First**: Good structure makes code generation easier
4. **Testing Your Output**: Always verify generated code works
5. **Documentation**: Critical for maintainability even with AI-generated code

---

## Conclusion

This project demonstrates how modern AI tools can accelerate development while maintaining code quality, when used with clear direction and thoughtful prompting. The ~90% AI-generated codebase is production-ready, well-documented, and follows React/TypeScript best practices.

**Key Takeaway**: AI is a powerful tool for developers who know what they want to build, not a replacement for technical decision-making.

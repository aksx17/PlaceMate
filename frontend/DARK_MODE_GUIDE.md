# Dark Mode Implementation Guide

## Quick Reference for Updating Remaining Pages

### Color Mapping

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| `bg-white` | `dark:bg-gray-800` | Cards, panels |
| `bg-gray-50` | `dark:bg-gray-900` | Page backgrounds |
| `bg-gray-100` | `dark:bg-gray-800` | Secondary backgrounds |
| `text-gray-900` | `dark:text-white` | Primary text |
| `text-gray-700` | `dark:text-gray-300` | Secondary text |
| `text-gray-600` | `dark:text-gray-400` | Tertiary text |
| `text-gray-500` | `dark:text-gray-500` | Muted text |
| `border-gray-300` | `dark:border-gray-600` | Borders |
| `border-gray-200` | `dark:border-gray-700` | Light borders |

### Common Patterns

#### Page Container
```jsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
```

#### Card Component
```jsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
```

#### Headings
```jsx
<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
```

#### Body Text
```jsx
<p className="text-gray-600 dark:text-gray-300">
```

#### Input Fields
```jsx
<input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
```

#### Buttons (Primary)
```jsx
<button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white">
```

#### Badges
```jsx
<span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
```

## Pages Updated
✅ App.jsx - Main wrapper with dark mode toggle
✅ Navbar.jsx - Added moon/sun toggle button
✅ Home.jsx - Hero and features sections
✅ Login.jsx - Form inputs and backgrounds
✅ Register.jsx - Form inputs and backgrounds

## Pages to Update
⏳ Dashboard.jsx
⏳ Jobs.jsx
⏳ Resume.jsx
⏳ ResumeEdit.jsx
⏳ Portfolio.jsx
⏳ Interview.jsx

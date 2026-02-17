# Neobrutalism Component Setup

This project uses [Neobrutalism Components](https://www.neobrutalism.dev/) for UI styling, which builds on top of shadcn/ui.

## Design System

### Key Characteristics

- **Zero Border Radius**: All components use sharp corners (`--radius: 0`)
- **Bold Borders**: 2px solid borders using foreground color
- **Hard Shadows**: Offset box shadows (e.g., `4px 4px 0 0 hsl(var(--foreground))`)
- **High Contrast**: Clear distinction between elements
- **Transition Effects**: Subtle transforms on hover/focus states

### Color Palette

The project uses a carefully curated neobrutalism palette defined in `app/globals.css`:

**Light Mode:**
- Background: `#F1FAEE` (Mint)
- Foreground: `#1D3557` (Navy)
- Primary: `#457B9D` (Steel Blue)
- Secondary: `#A8DADC` (Light Teal)
- Accent: `#2A9D8F` (Teal)
- Destructive: `#E63946` (Red)
- Warning: `#F3722C` (Orange)

**Dark Mode:**
- Background: `#1D3557` (Navy)
- Foreground: `#F1FAEE` (Mint)
- Primary: `#A8DADC` (Light Teal)
- Colors invert while maintaining high contrast

## Component Styling

All UI components follow neobrutalism principles:

### Buttons
- Bold 2px borders
- 4px hard shadow
- Hover: slight translate with reduced shadow
- Active: larger translate, no shadow

### Cards
- 2px borders
- 4px shadow
- Hover: subtle shift animation

### Inputs
- 2px borders
- Focus: shadow appears with slight shift
- No rounded corners

### Badges
- 2px borders
- 2px shadow
- Uppercase text
- Bold font weight

## Installing New Components

### Prerequisites

The project already has `components.json` configured for neobrutalism components.

### Via Neobrutalism CLI

For components listed on [neobrutalism.dev](https://www.neobrutalism.dev/):

```bash
# Example: Install button component
npx shadcn@latest add https://neobrutalism.dev/r/button.json

# Example: Install card component
npx shadcn@latest add https://neobrutalism.dev/r/card.json
```

Visit the [components page](https://www.neobrutalism.dev/components) to find CLI commands for each component.

### Manual Installation

For components without CLI support:

1. Go to the component page on neobrutalism.dev
2. Click the "shadcn docs" link
3. Install the base shadcn component:
   ```bash
   npx shadcn@latest add [component-name]
   ```
4. Return to neobrutalism.dev
5. Copy the neobrutalism variant code
6. Replace the content in `components/ui/[component-name].tsx`

## Current Components

The following components have been replaced with official neobrutalism components:

- ✅ Button (variants: default, noShadow, neutral, reverse)
- ✅ Card
- ✅ Input
- ✅ Badge
- ✅ Label
- ✅ Dialog
- ✅ Dropdown Menu
- ✅ Tooltip
- ✅ Avatar
- ✅ Progress
- ✅ Tabs
- ✅ Skeleton

### Button Variants

The neobrutalism button component has specific variants:
- **default**: Main colored button with shadow
- **neutral**: Secondary background with shadow
- **noShadow**: Main colored button without shadow
- **reverse**: Button with reverse shadow animation

**Note**: The old `outline` and `ghost` variants are not available. Use `neutral` or `noShadow` instead.

## Customization

### Shadows

Modify shadow sizes in `app/globals.css`:

```css
:root {
  --shadow-sm: 2px 2px 0 0 hsl(var(--foreground));
  --shadow-md: 4px 4px 0 0 hsl(var(--foreground));
  --shadow-lg: 6px 6px 0 0 hsl(var(--foreground));
  --shadow-xl: 8px 8px 0 0 hsl(var(--foreground));
}
```

### Colors

Update color values in the `:root` and `.dark` selectors in `app/globals.css`.

### Borders

The standard border width is defined as:

```css
:root {
  --border-width: 2px;
}
```

## Best Practices

1. **Consistency**: Always use the defined CSS variables
2. **Sharp Corners**: Never add border-radius
3. **Bold Typography**: Prefer font-bold over font-normal
4. **High Contrast**: Ensure text is easily readable
5. **Animations**: Keep transitions snappy (200-300ms)
6. **Shadows**: Use appropriate shadow size for hierarchy

## Resources

- [Neobrutalism Components](https://www.neobrutalism.dev/)
- [Components Gallery](https://www.neobrutalism.dev/components)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Design Inspiration](https://www.neobrutalism.dev/docs/resources)

## Troubleshooting

### Components don't have the neobrutalism style

1. Ensure `app/globals.css` is imported in `app/layout.tsx`
2. Check that CSS variables are defined in `:root`
3. Verify Tailwind CSS is properly configured

### Shadows not appearing

1. Check element has `shadow-[...]` class
2. Ensure foreground color is defined
3. Verify element has proper z-index

### Hover effects not working

1. Add `transition-all` class
2. Include both `translate` and `shadow` changes in hover state
3. Ensure element is interactive (not disabled)

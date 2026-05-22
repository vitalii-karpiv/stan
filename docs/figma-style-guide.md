# Figma Style Guide Notes

Source: [Stan website, frame `Section 1` (`186:971`)](https://www.figma.com/design/cQbilcxHQwCZvHTgUrVIcX/Stan-website?node-id=186-971&t=LlayZMMaheP5oY05-4)

This Figma frame is a design-system reference section, not a finished storefront screen. It documents the core typography, color palette, and several reusable storefront components for the Stan website.

## Frame Contents

- **Typography panel**: a table of text roles with font family, weight, size, and intended usage.
- **Color panel**: primary brand colors, accent color, and additional neutral colors.
- **Component panel**: references for desktop/mobile buttons, label chips, and desktop/mobile product cards.

## Color Tokens

| Token | Hex | Intended role |
|---|---:|---|
| Main | `#4C2F1F` | Primary brand text/dark brown |
| Accent | `#F76503` | CTA and highlight orange |
| Additional 1 | `#787171` | Secondary text, borders, dashed placeholder outlines |
| Additional 2 | `#CDCDCD` | Light neutral support color |

Current project note: `src/app/globals.css` uses `--color-accent: #F26C23`, which is close but not identical to the Figma accent `#F76503`.

## Typography Tokens

| Role | Font | Weight | Size | Usage from Figma |
|---|---|---:|---:|---|
| Heading 1 | Muller Next Wide Trial | Extra Bold | 40px | Only for the homepage hero heading |
| Heading 2 | Muller Next Wide Trial | Extra Bold | 34px | Main page headings on pages such as catalog and builder |
| Heading 3 | Muller Next Wide Trial | Extra Bold | 26px | Other section/page headings |
| Heading 4 | Montserrat | Regular | 26px | Section subheadings and product-page prices |
| Heading 5 | Muller Next Wide Trial | Regular | 20px | Section subheadings and product-page prices |
| Heading 6 | Montserrat | Regular | 20px | Subheadings inside content sections |
| Heading 7 | Montserrat | Medium/Semibold | 16px | Small text blocks, selection blocks, paragraph-title emphasis, filter names |
| Body text | Montserrat | Regular | 16px | Main body copy |
| Quote text | Kosko Regular | Regular | 36px | Quotes or decorative text |
| Link text | Muller Next Wide Trial | Regular | 16px | Text links that navigate or open popups |

### Button Text Ambiguity

The visible table in the Figma frame lists **Button text** as `Montserrat`, `Regular`, `20px`. The exported Figma variable data reports **Button text** as `Muller Next Wide Trial`, `ExtraBold`, `20px`. Confirm this in Figma before replacing the current button styling globally.

## Component References

The frame includes these component instances:

| Component | Figma instance | Size |
|---|---|---:|
| Desktop button | `Button_desktop` | 158 x 45 |
| Mobile button | `Button_mobile` | 114 x 33 |
| Label chip | `Chip` | 95 x 32 and 117.43 x 32 examples |
| Desktop product card | `Product_Card_desktop` | 300 x 465 |
| Mobile product card | `Product_Card_mobile` | 168 x 263 |

The button and label areas are grouped inside dashed containers with `#787171` outlines and 10px corner radius. Treat those dashed frames as documentation containers, not production UI styling.

## Implementation Notes

- The Figma direction is more specific than the older requirements doc: use **Muller Next Wide Trial**, **Montserrat**, and **Kosko Regular** as the target brand fonts if they are available/licensed for web use.
- The current codebase uses Google fonts `Inter` and `Cormorant Garamond`; this does not match the Figma typography.
- Prefer adding these values as Tailwind v4 theme tokens in `src/app/globals.css` before broad component updates.
- Product card dimensions in the design imply a desktop card ratio of roughly `20:31` and a mobile ratio of roughly `168:263`, close to the current `3:4` product image area but taller once text content is included.

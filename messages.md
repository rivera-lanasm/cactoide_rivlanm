# i18n Translation System in Cactoide

## What is i18n?

**i18n** = **i**nternationalizatio**n** (18 letters between 'i' and 'n')

It's a system for managing text content separately from code, making it easy to:
- Update text without touching component files
- Support multiple languages by swapping JSON files
- Keep all user-facing text in one centralized location

---

## How It Works

### The Data Flow

```
messages.json          →    i18n.ts          →    +page.svelte       →    Browser
(Text content)              (Lookup logic)        (Component code)        (Rendered HTML)

{                           t('home.title')       <h1>                    <h1>
  "home": {                      ↓                  {t('home.title')}      Cactoide - RSVP
    "title": "..."           Returns string       </h1>                  </h1>
  }
}
```

---

## File Structure

### 1. **Data Source:** `src/lib/i18n/messages.json`

All text content lives here as key-value pairs:

```json
{
  "home": {
    "title": "Cactoide - The RSVP site",
    "subtitle": "The Ultimate RSVP Platform",
    "createEventNow": "Create Event Now"
  }
}
```

**Structure:**
- Nested objects organize related text
- Keys use dot notation: `home.title`, `home.subtitle`
- Values are the actual text displayed to users

### 2. **Transform Logic:** `src/lib/i18n/i18n.ts`

This file contains the `t()` function that retrieves text:

```typescript
import messages from './messages.json';

export function t(key: string): string {
  // Split "home.title" into ["home", "title"]
  const keys = key.split('.');
  let value = messages;

  // Navigate nested object
  for (const k of keys) {
    value = value[k];
  }

  return value;  // Return the string
}
```

**What it does:**
1. Takes a key like `"home.title"`
2. Splits it by dots: `["home", "title"]`
3. Navigates the JSON object: `messages.home.title`
4. Returns the string value: `"Cactoide - The RSVP site"`

**Additional Features:**
- **Parameter interpolation:** Replace placeholders in text
  ```typescript
  t('event.title', { eventName: 'Party' })
  // "Event - {eventName}" → "Event - Party"
  ```
- **Error handling:** Returns the key itself if not found
- **Console warnings:** Alerts you to missing translations

### 3. **Consumer:** `src/routes/+page.svelte`

Components import and use the `t()` function:

```svelte
<script lang="ts">
  import { t } from '$lib/i18n/i18n.js';
</script>

<h1>{t('home.title')}</h1>
<h2>{t('home.subtitle')}</h2>
<button>{t('home.createEventNow')}</button>
```

**How to use:**
- Import: `import { t } from '$lib/i18n/i18n.js'`
- Call in template: `{t('key.name')}`
- The curly braces `{}` tell Svelte to evaluate the JavaScript expression

---

## Step-by-Step Example

### When you write this in a component:

```svelte
<h1>{t('home.title')}</h1>
```

### Here's what happens:

1. **Lookup:** Function finds `messages.home.title` in the JSON
2. **Return:** Gets value `"Cactoide - The RSVP site"`
3. **Render:** Browser displays:
   ```html
   <h1>Cactoide - The RSVP site</h1>
   ```

---

## Common Patterns

### Basic Usage
```svelte
{t('home.subtitle')}
```

### With Parameters
```svelte
{t('event.title', { eventName: 'Birthday Party' })}
```
The JSON would look like:
```json
{
  "event": {
    "title": "{eventName} - Cactoide"
  }
}
```
Result: `"Birthday Party - Cactoide"`

### In Attributes
```svelte
<button aria-label={t('event.deleteEventAriaLabel')}>
  Delete
</button>
```

### In Meta Tags
```svelte
<svelte:head>
  <title>{t('home.title')}</title>
  <meta name="description" content={t('home.description')} />
</svelte:head>
```

---

## Key Concepts for Svelte Newcomers

### 1. **Import Path Alias**
```javascript
import { t } from '$lib/i18n/i18n.js';
```
- `$lib` is a shortcut for `src/lib/`
- This is a SvelteKit convention
- Full path would be: `../../lib/i18n/i18n.js`

### 2. **Curly Braces = Dynamic Content**
```svelte
<h1>{t('home.title')}</h1>
```
- `{}` tells Svelte: "Run this JavaScript and insert the result"
- Without `{}`, it would display the literal text `t('home.title')`

### 3. **Template Expressions**
Anything inside `{}` is JavaScript:
```svelte
<div>{1 + 1}</div>              <!-- Shows: 2 -->
<div>{t('home.title')}</div>    <!-- Shows: Cactoide - The RSVP site -->
<div>{'Hello ' + 'World'}</div> <!-- Shows: Hello World -->
```

### 4. **JSON Import**
```typescript
import messages from './messages.json';
```
- SvelteKit/Vite allows importing JSON files directly
- The entire JSON becomes a JavaScript object
- This happens once when the app builds/starts

---

## How to Modify Text

### To change existing text:

1. Open `src/lib/i18n/messages.json`
2. Find the key (e.g., `"home.title"`)
3. Change the value
4. Save the file
5. The app auto-reloads with new text (no code changes needed)

### To add new text:

1. **Add to JSON:**
   ```json
   {
     "home": {
       "newFeature": "This is my new feature"
     }
   }
   ```

2. **Use in component:**
   ```svelte
   <p>{t('home.newFeature')}</p>
   ```

---

## Translation System Benefits

### 1. **Separation of Concerns**
- **Developers** work on component structure
- **Content writers** work on text in JSON
- No conflicts between the two

### 2. **Single Source of Truth**
All text in one place makes it easy to:
- Find and update copy
- Ensure consistency across the app
- Audit all user-facing text

### 3. **Multi-language Ready**
To add a new language:
1. Copy `messages.json` to `es.json` (Spanish)
2. Translate all values
3. Rename to `messages.json` to activate

### 4. **Type Safety**
TypeScript can check that keys exist (with proper setup), preventing typos

---

## Debugging Tips

### Text not showing?
1. Check browser console for warnings: `Translation key not found: ...`
2. Verify the key exists in `messages.json`
3. Check spelling and case sensitivity

### Wrong text appearing?
1. Verify you're using the correct key
2. Check `messages.json` for the expected value
3. Clear browser cache and reload

### Hot reload not working?
1. Save the file (Ctrl+S / Cmd+S)
2. Check the terminal for Vite errors
3. Manually refresh browser if needed

---

## Summary

**The i18n system in Cactoide:**
- Stores all text in `messages.json`
- Uses the `t()` function to retrieve text by key
- Allows text updates without code changes
- Supports parameter interpolation for dynamic content
- Is simple, lightweight, and doesn't require external libraries

**To use it:**
1. Import: `import { t } from '$lib/i18n/i18n.js'`
2. Call: `{t('section.key')}`
3. Done!

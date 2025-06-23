# Esquie.org Design Document

## Project Overview

A minimalist web application paying homage to Esquie, the beloved character from Clair Obscur: Expedition 33. The site features a single interactive page that pairs random Esquie quotes with random character images for a delightful user experience.

## Character Context

Esquie is known for his:
- Unique "Wheee" (happy) and "Whooo" (sad) emotional system
- Childlike wonder combined with unexpected wisdom
- Wholesome personality and immense positivity
- Charming simplicity and endearing speech patterns
- Creating nicknames using double-name tradition (Lulu, Maemae, Scisci, Verver)

## User Experience Design

### User Journey
1. **Landing State**: User arrives at esquie.org
2. **Welcome Prompt**: "Do you want to spend time with Esquie?"
3. **Single Action**: User clicks "Yes" (only available option)
4. **Content Display**: Random Esquie image + random quote combination
5. **Repeat Interaction**: User can click "Yes" again for new combinations

### Visual Design Principles
- **Whimsical & Simple**: Reflects Esquie's charming simplicity
- **Wholesome Aesthetic**: Warm, friendly colors and typography
- **Mobile-First**: Responsive design for all devices
- **Fast Loading**: Minimal assets, optimized for speed
- **Accessible**: Clear contrast, readable fonts, keyboard navigation

### Interaction Design
- **Single Button Interface**: Reduces cognitive load
- **Immediate Feedback**: New content appears instantly
- **Endless Discovery**: Combinations create replayability
- **No Dead Ends**: Always actionable next step available

## Functional Requirements

### Core Functionality
1. **Welcome Screen**
   - Display question: "Do you want to spend time with Esquie?"
   - Single "Yes" button (no "No" option - maintains character's positive nature)
   - Responsive layout for mobile/desktop

2. **Content Display**
   - Show random image from available Esquie images
   - Display random quote from curated quote collection
   - Present image-quote combination in visually appealing layout

3. **Interaction Loop**
   - After viewing content, show "Yes" button again
   - Each click generates new random combination
   - Smooth transitions between states

4. **Content Management**
   - 6 available images (esquie1.jpg through esquie6.jpg)
   - 6 curated quotes from QUOTES.md
   - True randomization (no guaranteed uniqueness between clicks)

### Non-Functional Requirements
- **Performance**: Page load under 2 seconds
- **Compatibility**: Works on modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive**: Functions on mobile, tablet, desktop
- **Reliability**: 99.9% uptime via Cloudflare
- **SEO**: Basic meta tags for social sharing

### Explicitly Out of Scope
- User authentication/accounts
- Data persistence/tracking
- Complex animations
- User-generated content
- Multi-page navigation
- Analytics beyond basic Cloudflare metrics

## Technical Architecture

### Platform: Cloudflare Workers (Recommended)
Based on deployment guide analysis, Workers is preferred over Pages for:
- Unified platform for frontend and backend
- Enhanced features and better tooling
- Future-proof development focus
- Static asset support
- Superior debugging capabilities

### Project Structure
```
esquie-app/
├── src/
│   ├── index.js              # Main Worker script
│   ├── assets/               # Static assets
│   │   ├── styles.css        # Application styling
│   │   ├── script.js         # Client-side interactions
│   │   └── images/           # Esquie character images
│   │       ├── esquie1.jpg
│   │       ├── esquie2.jpg
│   │       ├── esquie3.jpg
│   │       ├── esquie4.jpg
│   │       ├── esquie5.jpg
│   │       └── esquie6.jpg
├── wrangler.toml             # Cloudflare configuration
├── package.json              # Project dependencies
└── .dev.vars                 # Local environment variables
```

### Data Architecture
- **Quotes Array**: Hardcoded in Worker script (6 quotes)
- **Images**: Static assets served via Cloudflare Assets binding
- **State Management**: Client-side only, no persistence required
- **API**: Single endpoint returning random quote + image filename

### Technical Components

#### 1. Worker Script (src/index.js)
**Responsibilities:**
- Route handling (main page, API endpoints, static assets)
- Random quote/image selection logic
- HTML template rendering
- Asset serving via Assets binding

**Key Functions:**
- `handleMainPage()`: Serve initial HTML
- `handleAPI()`: Return random quote/image combination
- `getRandomQuote()`: Select from quotes array
- `getRandomImage()`: Select from available images

#### 2. Client-Side Script (src/assets/script.js)
**Responsibilities:**
- Button click handling
- AJAX requests to get new combinations
- DOM updates for quote/image display
- Smooth transitions between states

**Key Functions:**
- `initializeApp()`: Set up initial state
- `handleYesClick()`: Process user interaction
- `updateContent()`: Refresh displayed content
- `displayCombination()`: Render quote/image pair

#### 3. Styling (src/assets/styles.css)
**Responsibilities:**
- Responsive layout system
- Typography matching Esquie's character
- Smooth transitions and animations
- Mobile-first design approach

**Key Features:**
- CSS Grid/Flexbox for layout
- Custom properties for theming
- Media queries for responsiveness
- Accessible color contrast

### API Design

#### Endpoint: `/api/random`
**Method:** GET  
**Response:**
```json
{
  "quote": "Stars are the apples of the sky.",
  "image": "esquie3.jpg"
}
```

**Implementation:**
```javascript
// Pseudo-code for random selection
const quotes = [/* 6 curated quotes */];
const images = [/* esquie1.jpg through esquie6.jpg */];

function getRandomCombination() {
  return {
    quote: quotes[Math.floor(Math.random() * quotes.length)],
    image: images[Math.floor(Math.random() * images.length)]
  };
}
```

## Implementation Plan

### Phase 1: Foundation Setup
**Dependencies:** None  
**Parallel Work Opportunity:** Yes

**Tasks:**
1. Initialize Cloudflare Workers project with Wrangler
2. Set up basic project structure
3. Configure wrangler.toml with assets binding
4. Create placeholder HTML template
5. Set up local development environment

**Deliverables:**
- Working local development server
- Basic HTML page accessible via `wrangler dev`
- Asset serving functional

### Phase 2: Content Integration
**Dependencies:** Phase 1 complete  
**Parallel Work Opportunity:** Yes (split between content and styling)

**Tasks:**
1. **Content Track:**
   - Move images from current location to src/assets/images/
   - Integrate quotes array into Worker script
   - Implement random selection logic
   - Create API endpoint for combinations

2. **UI Track:**
   - Design and implement CSS styling
   - Create responsive layout system
   - Design button and content display components

**Deliverables:**
- Functional API returning random combinations
- Complete visual design implementation
- Responsive layout working on multiple screen sizes

### Phase 3: Interaction Implementation
**Dependencies:** Phase 2 complete  
**Parallel Work Opportunity:** Limited

**Tasks:**
1. Implement client-side JavaScript for button handling
2. Connect frontend to API endpoint
3. Add smooth transitions between states
4. Test interaction flow thoroughly

**Deliverables:**
- Complete user interaction loop
- Smooth content updates
- Error handling for API failures

### Phase 4: Polish & Deployment
**Dependencies:** Phase 3 complete  
**Parallel Work Opportunity:** Yes (testing and deployment prep)

**Tasks:**
1. **Quality Track:**
   - Cross-browser testing
   - Mobile device testing
   - Performance optimization
   - Accessibility audit

2. **Deployment Track:**
   - Configure custom domain (esquie.org)
   - Set up production environment variables
   - Configure DNS settings
   - Deploy to production

**Deliverables:**
- Production-ready application
- Live site at esquie.org
- Performance metrics meeting requirements

## Parallel Development Opportunities

### High Parallelization (Can work simultaneously):
1. **Foundation Setup** + **Content Preparation**
2. **CSS Styling** + **API Implementation**
3. **Testing** + **Deployment Configuration**

### Sequential Dependencies:
1. Foundation → Content Integration
2. Content Integration → Interaction Implementation
3. Interaction Implementation → Polish
4. Polish → Production Deployment

## Risk Assessment & Mitigation

### Technical Risks
1. **Asset Size Limits**: Cloudflare Workers 1MB bundle limit
   - *Mitigation*: Optimize images, use WebP format, separate asset serving
2. **API Rate Limiting**: Potential request limits
   - *Mitigation*: Implement client-side caching, reasonable request throttling
3. **Browser Compatibility**: Modern JS features
   - *Mitigation*: Use ES5-compatible syntax, test on target browsers

### Content Risks
1. **Image Quality**: Existing images may need optimization
   - *Mitigation*: Image compression and format optimization
2. **Quote Accuracy**: Ensuring quotes match character
   - *Mitigation*: Cross-reference with ESQUIE_NOTES.md

## Success Metrics

### User Experience
- Page load time < 2 seconds
- Mobile-friendly score > 95 (Google PageSpeed)
- Zero broken functionality across target browsers

### Technical Performance
- 99.9% uptime via Cloudflare
- < 100ms API response time
- Compressed asset sizes under limits

### Content Quality
- All 6 images display correctly
- All 6 quotes render properly
- Random distribution appears balanced over 20+ interactions

## Future Enhancement Opportunities

While out of scope for initial release, potential additions include:
- Social sharing buttons for favorite combinations
- Simple animation effects for content transitions
- Additional quotes from expanded character research
- Seasonal themes or special combinations
- Basic visitor counter (without personal tracking)

---

*This design document provides comprehensive guidance for implementing the Esquie.org project while maintaining the character's wholesome, simple nature and ensuring technical excellence through Cloudflare's modern platform.*
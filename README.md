# AI-Powered Outfit Recommendation System

An intelligent fashion stylus that generates complete, cohesive 5-piece outfit combinations based on a single selected product. Designed for high performance, style compatibility, and color harmony.

---

## Project Overview

This project is a full-stack AI-powered recommendation engine. It simulates the decision-making process of a fashion stylist by considering:
*   **Style & Occasion Matching:** Ensuring formal shoes go with suits, not sweatpants.
*   **Color Harmony:** Using algorithmic color theory to prevent clashing outfits.
*   **Budget Awareness:** Distributing budget across the remaining outfit pieces.
*   **Seasonality:** Matching items based on the season of the selected base product to ensure overall seasonal consistency.

The system is built to be **extremely fast (sub-1s response)** and **scalable**.

---

## Architecture

The system follows a clean **MVC (Model-View-Controller)** architecture with a layered approach to separation of concerns.

### Tech Stack
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Frontend:** React (Vite)

### Data Flow
1.  **Request:** Client sends `selectedProduct`, `gender`, `occasion`, `budget`.
2.  **Controller:** Validates input and calls the Recommendation Engine.
3.  **Service/Model - "The Stylist Brain":**
    *   **Retrieval:** Fetches candidate items from the **In-Memory Cache** (for speed).
    *   **Filtering:** Removes items incompatible by Gender, Category, or Style.
    *   **Scoring & Ranking:** Each candidate is scored against the input product using a weighted algorithm.
    *   **Selection:** The best item for each role (Top, Bottom, Footwear, Accessory) is selected.
4.  **Response:** Returns a JSON object with the complete outfit and pricing details.

---

## Recommendation Logic

The core intelligence lies in the `calculateMatchScore` function (`backend/models/recommendation-model.js`). It assigns a score (0.0 - 1.0) based on:

1.  **Color Harmony (20%)**:
    *   Checks if the candidate's `primary_color` harmonizes with the base product's color.
    *   Uses a predefined `COLOR_HARMONY` rule set (e.g., *Navy* pairs with *White, Beige, Grey*).
2.  **Occasion & Season Fit (30%)**:
    *   Strict matching for rigorous occasions (Formal), relaxed for Casual.
3.  **Brand Affinity (30%)**:
    *   Slight preference for matching brands to ensure consistent design language.
4.  **Price Optimization (10%)**:
    *   Ensures the item fits within the remaining budget slice.

### Color Inference
Since raw data often lacks explicit color fields, we implemented an **Inference Engine** in our import pipeline (`importExcel.js`) that detects colors from product standard text (Title, Description, Tags) and normalizes them (e.g., "Crimson" → "Red").

---

## Performance Strategy

**Goal:** < 1 second response time.

**Solution:**
1.  **In-Memory Caching (`VALID_PRODUCTS_CACHE`):**
    *   Products are loaded from MongoDB into memory on server start (and refreshed periodically).
    *   Filtering 10,000+ items in memory takes milliseconds vs. database queries which take 100s of ms.
2.  **Image Pre-Validation:**
    *   Only products with valid, existing images are cached, preventing broken UI layouts.
3.  **Efficient Data Structures:**
    *   Using `Sets` for O(1) lookup of used SKUs to prevent duplicates.

**Result:** Typical API response time is **~10-50ms**.

---

## AI Usage

This system uses a **Deterministic Rule-Based AI** approach.
*   **Why not Deep Learning?**
    *   For structured tabular data with clear rules (Fashion compatibility), rule-based systems offer **explainability**, **speed**, and **predictability** superior to black-box neural networks for this scale.
    *   It guarantees specific constraints (e.g., "Must wear shoes") that generative models might hallucinate.

---

## How to Run

### Prerequisites
*   Node.js
*   MongoDB

### Backend Setup
```bash
cd backend/outfit-recommendation
npm install
# Create a .env file same as env.sample
# Add your MongoDB connection string in the .env file
node scripts/importExcel.js
npm run dev
```

### Frontend Setup
```bash
cd frontend/outfit-recommendation
npm install
npm run dev
```

### Sample API Request
**POST** `/api/recommendations/outfit`
```json
{
  "selectedProduct": {
    "sku_id": "AIFO1LO07TRWH",
    "brand_name": "nike",
    "category": "casual footwear",
    "featured_image": "https://cdn.shopify.com/s/files/1/0570/7389/3509/t/1/assets/02-04-2025-202946-aifo1lo07trwh_photo1.png",
    "gender": "male",
    "lowest_price": 6998,
    "occasion": "casual",
    "product_type": "sneakers",
    "season": "all",
    "sub_category": "sneakers",
    "title": "Air Force 1 Low 07 Triple White",
    "primary_color": "white"
},
  "gender": "Male",
  "occasion": "Casual",
  "budget": 5000,
  "season": "all"
}

```

---

## Assumptions & Trade-offs
*   **AI Enhancement:** Fast subscription-based AI APIs (Claude/GPT-4o mini) could generate creative suggestions, but would increase latency from 50ms → 800ms+ and add $0.01-0.05 per request costs. Rule-based approach chosen for assessment's <1s mandatory requirement.
*   **Data Quality:** Assumed product titles contain color keywords. If not, color defaults to "Neutral".
*   **Outfit Structure:** Fixed to 5 pieces (Top/Layer/Bottom/Shoes/Accessory). Dynamic outfit templates could be added in V2.
*   **Simple Budgeting:** Budget is distributed loosely; a stricter knapsack solver could optimize price perfectly but would be slower.
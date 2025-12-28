# Micro-Renovator: Low-Cost Renovation Puzzle

A 3D interior design puzzle game inspired by "low-cost renovation" memes. The goal is to meet specific living requirements (e.g., "sleeps 3 people") using the lowest budget possible, resulting in absurd, cramped, and unlivable room layouts.

## Features

*   **3D First-Person Gameplay**: Walk around your tiny room and place furniture in real-time.
*   **Phase System**: Progress through increasingly difficult requirements. Completing a phase locks existing furniture, forcing you to build around your previous mistakes.
*   **Budget Challenge**: Every dollar counts. Use the cheapest items possible to meet the goals.
*   **Physics & Logic**:
    *   **Collision System**: Prevent items from overlapping or clipping through walls.
    *   **Placement Rules**: Some items (beds) must be on the floor, while others (TVs, showers) mount to walls.
    *   **Stacking**: Place items on top of tables or mats (if allowed).
*   **Localization**: Fully localized in English and Traditional Chinese.

## Controls

*   **WASD**: Move Player
*   **Mouse**: Look Around
*   **E**: Toggle Inventory / Cursor Mode
*   **Left Click**: Place Item
*   **Right Click**: Remove Item (Unlocked items only)
*   **Scroll Wheel**: Rotate Item
*   **UI Controls**: Use the gear icon to Restart or Switch Language.

## Installation & Play

1.  **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Play**: Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## Tech Stack

*   **Three.js**: 3D Rendering Engine
*   **Vite**: Build Tool
*   **Vanilla JS**: Game Logic

## License

MIT

# Warhammer 40k: Boarding Actions List Builder

An unofficial web application for building army lists for the **Warhammer 40k: Boarding Actions** game mode (10th Edition).

Built with **React** and **Vite**.

## 🚀 Features

* **Detachment-Based Mustering:** Select a specific Boarding Actions Detachment (e.g., *Chosen Cabal*) to see the specific rules and restrictions for that force.
* **Real-Time Validation:** * Automatically validates "Mustering Rules" (e.g., "Select up to 2 Leaders").
    * Enforces the **500 Points** cap.
    * Prevents adding more units than allowed (e.g., max 3 Troops).
* **Dynamic Roster:** Add units to your list, track points totals, and remove units easily.
* **Visual Feedback:** Buttons allow/disable automatically based on specific unit limits and category caps.

## 🛠️ How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/boarding-actions-builder.git](https://github.com/YOUR_USERNAME/boarding-actions-builder.git)
    cd boarding-actions-builder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser to the local URL (usually `http://localhost:5173`).

## 🔮 Roadmap / To-Do

* [x] Basic Roster Logic (Add/Remove)
* [x] Point Validation (500pts limit)
* [x] Advanced Mustering Rules (Category limits vs Unit limits)
* [ ] **Unit Stats:** View Move, Toughness, Save, etc.
* [ ] **Stratagems & Enhancements:** View rules for the selected Detachment.
* [ ] **More Factions:** Currently supports Thousand Sons.

## ⚠️ Disclaimer

This project is unofficial and is not associated with or endorsed by Games Workshop. 

Warhammer 40,000, Boarding Actions, and all associated logos, illustrations, images, names, creatures, races, vehicles, locations, weapons, characters, and the distinctive likenesses thereof, are either ® or TM, and/or © Games Workshop Limited, variably registered around the world. Used without permission.
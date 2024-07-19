# Appointment Booking System

A responsive appointment booking system that allows users to navigate through categories and subcategories of services. The system adapts seamlessly between desktop and mobile views.

## Features

- Responsive design for desktop and mobile
- Category and subcategory navigation
- Active state indication for categories
- Rotating arrows for expandable categories

## Technologies Used

- HTML
- SCSS
- JavaScript
- Webpack

## Setup and Installation

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository:
   ```sh
   git clone <https://github.com/Samvel25/erpswiss-task.git>
   cd <repository-directory>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the project:
   ```sh
   npm run build
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Open your browser at `http://localhost:3000`.

## Project Structure

project-root/
├── dist/
├── src/
│ ├── styles/
│ ├── scripts/
│ └── images/
├── .gitignore
├── package.json
├── webpack.config.js
└── README.md

## Styling

- **Variables**: `_variables.scss`
- **Base styles**: `_base.scss`
- **Layout styles**: `_layout.scss`
- **Category styles**: `_category.scss`
- **Main stylesheet**: `main.scss`

## JavaScript Functions

- `initializeCategories()`: Initializes categories based on screen size.
- `initializeDesktopCategories()`: Sets up desktop view.
- `initializeMobileCategories()`: Sets up mobile view.
- `renderDesktopSubcategories()`: Renders subcategories for desktop.
- `renderMobileSubcategories()`: Renders subcategories for mobile.
- `clearCategories()`: Clears categories and removes event listeners.
- `updateRightmostContainerBackground()`: Updates the background of the rightmost container.

## License

Licensed under the MIT License.

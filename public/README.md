# Kottage v2 - Property Rental Platform

A comprehensive property rental platform built with React, TypeScript, and Firebase, featuring advanced analytics and property management capabilities.

## 🌟 Features

### Core Platform
- **Property Management**: Complete CRUD operations for vacation rentals
- **User Authentication**: Secure login/registration system
- **Search & Discovery**: Advanced property search with filters
- **Booking System**: Full reservation management
- **Review System**: Guest reviews and host responses
- **Multi-role Support**: Guest, Host, Staff, and Admin roles

### 📊 Analytics & Popularity Engine
- **Real-time Tracking**: User interaction analytics
- **Industry-Standard Scoring**: Property popularity algorithm
- **Comprehensive Dashboard**: Detailed performance metrics
- **AI Recommendations**: Performance improvement insights
- **Competition Analysis**: Market positioning data

### 🏢 Multi-tenant Architecture
- **Admin Portal**: `admin.domain.com` - Platform management
- **Staff Portal**: `staff.domain.com` - Support operations
- **Main Platform**: `domain.com` - Guest and host interface

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Firebase account
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/ravaney/Kottagev2.git
cd Kottagev2

# Install dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..

# Start development server
npm start
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication, Realtime Database, Cloud Functions, and Storage
3. Copy your Firebase config to `src/firebase.ts`
4. Deploy Cloud Functions:
```bash
cd functions
firebase deploy --only functions
```

## 📊 Analytics System

### For Property Owners
Access detailed analytics for your properties:
1. Go to **Dashboard** → **My Properties**
2. Click **⋮ menu** on any property
3. Select **"View Analytics"**

### Key Metrics
- **Popularity Score**: Overall performance indicator (0-100)
- **Conversion Rate**: Booking success rate
- **Click-Through Rate**: Search performance
- **Guest Engagement**: User interaction metrics
- **Market Position**: Competitive analysis

### Analytics Dashboard Features
- 📈 **Performance Tracking**: Views, bookings, revenue
- 🔍 **Search Analytics**: Impressions, CTR, rankings
- 👥 **Guest Engagement**: Time on page, photo views
- ⭐ **Review Management**: Ratings, response rates
- 🏆 **Competition**: Market positioning
- 💡 **AI Insights**: Improvement recommendations

## 📖 Documentation

### Analytics Documentation
- **[Complete Analytics Guide](./ANALYTICS_DOCUMENTATION.md)** - Comprehensive system documentation
- **[Quick Reference](./ANALYTICS_QUICK_REFERENCE.md)** - Developer quick start guide

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

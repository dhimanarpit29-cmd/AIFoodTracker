# AI-Powered Meal Plate Analyzer

A comprehensive food analysis application that uses advanced AI to analyze meal photos and provide detailed nutritional insights, health recommendations, and personalized suggestions.

## Features

### 🤖 AI-Powered Analysis
- **Real-time Food Detection**: Uses Google Cloud Vision API for accurate food recognition
- **Nutritional Analysis**: Integrates with Nutritionix API for precise nutritional data
- **Health Scoring**: AI-generated health scores based on nutritional balance
- **Smart Recommendations**: Personalized suggestions based on your meal history

### 📊 Advanced Analytics
- **Macro Distribution**: Visual breakdown of protein, carbs, and fat percentages
- **Health Insights**: Comprehensive analysis of your eating patterns
- **Trend Analysis**: Track nutritional trends over time
- **Personalized Recommendations**: AI-generated meal suggestions

### 🎯 Enhanced User Experience
- **Real-time Progress**: Live analysis status updates
- **Interactive Visualizations**: Charts and graphs for nutrition data
- **Confidence Scores**: AI confidence levels for each detection
- **Detailed Food Cards**: Comprehensive information for each detected food

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Cloud Vision API** for food detection
- **Nutritionix API** for nutritional data
- **JWT Authentication**
- **Multer** for file uploads

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **React Dropzone** for file uploads
- **React Icons** for UI elements
- **Axios** for API calls

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Vision API credentials
- Nutritionix API credentials

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-meal-analyzer

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/meal-analyzer

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google Cloud Vision API Configuration
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# Nutritionix API Configuration
NUTRITIONIX_APP_ID=your-nutritionix-app-id
NUTRITIONIX_APP_KEY=your-nutritionix-app-key

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 3. API Setup

#### Google Cloud Vision API
1. Create a Google Cloud Project
2. Enable the Vision API
3. Create a service account and download the JSON key
4. Set the `GOOGLE_APPLICATION_CREDENTIALS` path to your key file

#### Nutritionix API
1. Sign up at [Nutritionix Developer Portal](https://developer.nutritionix.com/)
2. Get your Application ID and Key
3. Add them to your `.env` file

### 4. Run the Application

```bash
# Start the backend server
cd server
npm run dev

# Start the frontend (in another terminal)
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Meals
- `POST /api/meals/upload` - Upload and analyze meal image
- `GET /api/meals` - Get user's meals with filtering
- `GET /api/meals/:id` - Get specific meal details
- `GET /api/meals/analysis/:id` - Get detailed meal analysis
- `GET /api/meals/recommendations` - Get personalized recommendations
- `POST /api/meals/analyze-image` - Analyze image without saving
- `GET /api/meals/health-insights` - Get health insights from history

### Analytics
- `GET /api/meals/analytics/daily` - Get daily nutrition analytics

## Usage

### Uploading a Meal
1. Navigate to the Upload Meal page
2. Drag and drop or click to select a meal photo
3. Add optional meal details (name, type, tags, notes)
4. Click "Analyze Meal" to get AI-powered analysis

### Viewing Results
- **Health Score**: Visual indicator of meal nutritional quality
- **Macro Distribution**: Percentage breakdown of protein, carbs, and fat
- **Detected Foods**: List of identified foods with confidence scores
- **Total Nutrition**: Complete nutritional breakdown
- **AI Insights**: Personalized recommendations and assessments

### Analytics Dashboard
- View daily, weekly, and monthly nutrition trends
- Track health score improvements over time
- Get personalized meal recommendations
- Monitor macro distribution patterns

## AI Features

### Food Detection
- Uses Google Cloud Vision API for accurate food recognition
- Supports multiple food items in a single image
- Provides confidence scores for each detection
- Fallback to mock data when APIs are unavailable

### Nutritional Analysis
- Integrates with Nutritionix API for precise nutritional data
- Calculates macro and micronutrient breakdowns
- Provides detailed nutritional information per food item
- Generates health scores based on nutritional balance

### Smart Recommendations
- Analyzes meal patterns and nutritional trends
- Provides personalized suggestions for improvement
- Offers alternative meal options based on preferences
- Generates dietary-specific recommendations

## Development

### Project Structure
```
├── server/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── uploads/         # File uploads
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── context/     # React context
│   └── public/          # Static assets
└── README.md
```

### Adding New AI Services
1. Install the required SDK/package
2. Add configuration to `.env` file
3. Update the AI analyzer utility
4. Add fallback mechanisms
5. Test with sample data

### Testing
```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API documentation

## Roadmap

- [ ] Mobile app development
- [ ] Recipe generation from detected ingredients
- [ ] Integration with fitness trackers
- [ ] Advanced dietary restriction support
- [ ] Meal planning features
- [ ] Social sharing capabilities

---

**Note**: This application requires API keys for Google Cloud Vision and Nutritionix services. Make sure to set up your credentials properly before running the application.

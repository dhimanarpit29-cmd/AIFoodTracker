import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiUpload,
  FiImage,
  FiX,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiTrendingUp,
  FiTarget
} from 'react-icons/fi';

const UploadMeal = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [formData, setFormData] = useState({
    mealType: 'lunch',
    name: '',
    tags: '',
    notes: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
  };

  const analyzeMeal = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', selectedFile);
    uploadFormData.append('mealType', formData.mealType);
    uploadFormData.append('name', formData.name);
    uploadFormData.append('tags', formData.tags);
    uploadFormData.append('notes', formData.notes);

    try {
      const response = await axios.post('/api/meals/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data.meal);
      toast.success('Meal analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze meal');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Meal Photo</h1>
          <p className="mt-2 text-gray-600">
            Upload a photo of your meal to get instant nutritional analysis with AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Your Meal
            </h2>

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Meal preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FiX />
                </button>
              </div>
            )}

            {/* Meal Details Form */}
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>

              <div>
                <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., healthy, protein-rich, vegetarian"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes about this meal..."
                />
              </div>

              <button
                onClick={analyzeMeal}
                disabled={!selectedFile || analyzing}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {analyzing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <FiImage className="mr-2" />
                    Analyze Meal
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analysis Results
            </h2>

            {analyzing && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FiLoader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing your meal with AI...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiCheck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-600 font-medium">Analysis Complete</span>
                  </div>
                  {analysisResult.aiAnalysis?.confidence && (
                    <div className="text-sm text-gray-500">
                      Confidence: {Math.round(analysisResult.aiAnalysis.confidence * 100)}%
                    </div>
                  )}
                </div>

                {/* Health Score */}
                {analysisResult.aiAnalysis?.healthScore && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Health Score</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            analysisResult.aiAnalysis.healthScore >= 80 ? 'bg-green-500' :
                            analysisResult.aiAnalysis.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${analysisResult.aiAnalysis.healthScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {analysisResult.aiAnalysis.healthScore}/100
                      </span>
                    </div>
                  </div>
                )}

                {/* Macro Distribution */}
                {analysisResult.aiAnalysis?.macroDistribution && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Macro Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Protein</span>
                        <span className="text-sm font-medium">
                          {analysisResult.aiAnalysis.macroDistribution.protein}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Carbs</span>
                        <span className="text-sm font-medium">
                          {analysisResult.aiAnalysis.macroDistribution.carbs}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fat</span>
                        <span className="text-sm font-medium">
                          {analysisResult.aiAnalysis.macroDistribution.fat}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Detected Foods</h3>
                  <div className="space-y-2">
                    {analysisResult.detectedFoods.map((food, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{food.name}</span>
                          {food.confidence && (
                            <div className="text-xs text-gray-500 mt-1">
                              Confidence: {Math.round(food.confidence * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {food.nutrition.calories} cal
                          </div>
                          <div className="text-xs text-gray-500">
                            P: {food.nutrition.protein}g C: {food.nutrition.carbs}g F: {food.nutrition.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Total Nutrition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {analysisResult.totalNutrition.calories}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {analysisResult.totalNutrition.protein}g
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">
                        {analysisResult.totalNutrition.carbs}g
                      </div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {analysisResult.totalNutrition.fat}g
                      </div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>

                  {/* Additional Nutrition Details */}
                  {(analysisResult.totalNutrition.fiber > 0 ||
                    analysisResult.totalNutrition.sugar > 0 ||
                    analysisResult.totalNutrition.sodium > 0) && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {analysisResult.totalNutrition.fiber > 0 && (
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="text-lg font-bold text-orange-600">
                            {analysisResult.totalNutrition.fiber}g
                          </div>
                          <div className="text-xs text-gray-600">Fiber</div>
                        </div>
                      )}
                      {analysisResult.totalNutrition.sugar > 0 && (
                        <div className="text-center p-2 bg-pink-50 rounded">
                          <div className="text-lg font-bold text-pink-600">
                            {analysisResult.totalNutrition.sugar}g
                          </div>
                          <div className="text-xs text-gray-600">Sugar</div>
                        </div>
                      )}
                      {analysisResult.totalNutrition.sodium > 0 && (
                        <div className="text-center p-2 bg-indigo-50 rounded">
                          <div className="text-lg font-bold text-indigo-600">
                            {analysisResult.totalNutrition.sodium}mg
                          </div>
                          <div className="text-xs text-gray-600">Sodium</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {analysisResult.aiAnalysis && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">AI Insights</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700 mb-2">
                          {analysisResult.aiAnalysis.overallAssessment}
                        </p>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            analysisResult.aiAnalysis.nutritionalBalance === 'good' ? 'bg-green-100 text-green-800' :
                            analysisResult.aiAnalysis.nutritionalBalance === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysisResult.aiAnalysis.nutritionalBalance.toUpperCase()} Balance
                          </span>
                        </div>
                      </div>

                      {analysisResult.aiAnalysis.recommendations && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                          <div className="space-y-1">
                            {analysisResult.aiAnalysis.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start">
                                <FiAlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <button
                    onClick={() => window.location.href = '/history'}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    View in Meal History
                  </button>
                  <button
                    onClick={() => window.location.href = '/analytics'}
                    className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            )}

            {!analyzing && !analysisResult && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <FiImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and analyze a meal to see results here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadMeal;

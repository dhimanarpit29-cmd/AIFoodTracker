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
  FiTarget,
  FiCamera,
  FiPlus
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <FiCamera className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-secondary-800">Upload Meal Photo</h1>
              <p className="text-lg font-body text-secondary-600 mt-2">
                Upload a photo of your meal to get instant nutritional analysis with AI-powered insights
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="card-title">Upload Your Meal</h2>
              <FiUpload className="h-6 w-6 text-primary-500" />
            </div>

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group ${
                  isDragActive
                    ? 'border-primary-400 bg-primary-50 scale-105'
                    : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="relative">
                  <FiUpload className="mx-auto h-16 w-16 text-secondary-400 mb-6 group-hover:text-primary-500 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-primary-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
                {isDragActive ? (
                  <div>
                    <p className="text-xl font-heading font-semibold text-primary-600 mb-2">Drop the image here!</p>
                    <p className="text-secondary-500">Release to upload your meal photo</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-heading font-semibold text-secondary-700 mb-2">
                      Drag & drop your meal photo here
                    </p>
                    <p className="text-secondary-500 mb-4">or click to browse files</p>
                    <p className="text-sm font-body text-secondary-400">
                      Supports JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Meal preview"
                  className="w-full h-72 object-cover rounded-3xl shadow-soft"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-3xl"></div>
                <button
                  onClick={removeFile}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl transition-all duration-200 transform hover:scale-110 shadow-soft"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  <p className="text-sm font-body text-secondary-700">
                    {selectedFile.name}
                  </p>
                </div>
              </div>
            )}

            {/* Meal Details Form */}
            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="form-label">
                  Meal Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>

              <div>
                <label htmlFor="mealType" className="form-label">
                  Meal Type
                </label>
                <select
                  id="mealType"
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="breakfast">🍳 Breakfast</option>
                  <option value="lunch">🥗 Lunch</option>
                  <option value="dinner">🍽️ Dinner</option>
                  <option value="snack">🥨 Snack</option>
                </select>
              </div>

              <div>
                <label htmlFor="tags" className="form-label">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., healthy, protein-rich, vegetarian"
                />
              </div>

              <div>
                <label htmlFor="notes" className="form-label">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Any additional notes about this meal..."
                />
              </div>

              <button
                onClick={analyzeMeal}
                disabled={!selectedFile || analyzing}
                className="btn-primary w-full flex items-center justify-center space-x-3 group"
              >
                {analyzing ? (
                  <>
                    <FiLoader className="animate-spin h-5 w-5" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <FiImage className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span>Analyze Meal</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="card-title">Analysis Results</h2>
              <FiTarget className="h-6 w-6 text-primary-500" />
            </div>

            {analyzing && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="relative">
                    <FiLoader className="animate-spin h-12 w-12 text-primary-500 mx-auto mb-6" />
                    <div className="absolute inset-0 bg-primary-400 rounded-full blur opacity-30"></div>
                  </div>
                  <p className="text-xl font-heading font-semibold text-secondary-700 mb-2">Analyzing your meal with AI...</p>
                  <p className="text-secondary-500 font-body">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-8">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <FiCheck className="h-5 w-5 text-primary-600" />
                    </div>
                    <span className="text-primary-700 font-heading font-semibold">Analysis Complete</span>
                  </div>
                  {analysisResult.aiAnalysis?.confidence && (
                    <div className="bg-white px-3 py-1 rounded-full">
                      <span className="text-sm font-body text-secondary-600">
                        {Math.round(analysisResult.aiAnalysis.confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
                </div>

                {/* Health Score */}
                {analysisResult.aiAnalysis?.healthScore && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-semibold text-secondary-800">Health Score</h3>
                      <span className="text-2xl font-bold text-primary-600">
                        {analysisResult.aiAnalysis.healthScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all duration-1000 ${
                          analysisResult.aiAnalysis.healthScore >= 80 ? 'bg-primary-500' :
                          analysisResult.aiAnalysis.healthScore >= 60 ? 'bg-accent-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysisResult.aiAnalysis.healthScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Macro Distribution */}
                {analysisResult.aiAnalysis?.macroDistribution && (
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-secondary-800 mb-4">Macro Distribution</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-700">P</span>
                          </div>
                          <span className="font-body text-secondary-700">Protein</span>
                        </div>
                        <span className="text-lg font-heading font-bold text-primary-600">
                          {analysisResult.aiAnalysis.macroDistribution.protein}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-accent-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-accent-700">C</span>
                          </div>
                          <span className="font-body text-secondary-700">Carbs</span>
                        </div>
                        <span className="text-lg font-heading font-bold text-accent-600">
                          {analysisResult.aiAnalysis.macroDistribution.carbs}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-secondary-700">F</span>
                          </div>
                          <span className="font-body text-secondary-700">Fat</span>
                        </div>
                        <span className="text-lg font-heading font-bold text-secondary-700">
                          {analysisResult.aiAnalysis.macroDistribution.fat}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-heading font-semibold text-secondary-800 mb-4">Detected Foods</h3>
                  <div className="space-y-3">
                {analysisResult.detectedFoods && analysisResult.detectedFoods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center">
                          <FiImage className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <span className="font-heading font-semibold text-secondary-800">{food.name}</span>
                          {food.confidence && (
                            <div className="text-xs font-body text-secondary-500 mt-1">
                              {Math.round(food.confidence * 100)}% confidence
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading font-bold text-lg text-secondary-800">
                        {food.nutrition.calories} cal
                      </div>
                      <div className="text-xs font-body text-secondary-500">
                        P: {food.nutrition.protein}g • C: {food.nutrition.carbs}g • F: {food.nutrition.fat}g
                      </div>
                    </div>
                  </div>
                ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-semibold text-secondary-800 mb-4">Total Nutrition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary-50 rounded-2xl">
                      <div className="text-3xl font-heading font-bold text-primary-600">
                        {analysisResult.totalNutrition.calories}
                      </div>
                      <div className="text-sm font-body text-secondary-600">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-accent-50 rounded-2xl">
                      <div className="text-3xl font-heading font-bold text-accent-600">
                        {analysisResult.totalNutrition.protein}g
                      </div>
                      <div className="text-sm font-body text-secondary-600">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-secondary-50 rounded-2xl">
                      <div className="text-3xl font-heading font-bold text-secondary-700">
                        {analysisResult.totalNutrition.carbs}g
                      </div>
                      <div className="text-sm font-body text-secondary-600">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-primary-50 rounded-2xl">
                      <div className="text-3xl font-heading font-bold text-primary-600">
                        {analysisResult.totalNutrition.fat}g
                      </div>
                      <div className="text-sm font-body text-secondary-600">Fat</div>
                    </div>
                  </div>

                  {/* Additional Nutrition Details */}
                  {(analysisResult.totalNutrition.fiber > 0 ||
                    analysisResult.totalNutrition.sugar > 0 ||
                    analysisResult.totalNutrition.sodium > 0) && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {analysisResult.totalNutrition.fiber > 0 && (
                        <div className="text-center p-3 bg-accent-50 rounded-2xl">
                          <div className="text-xl font-heading font-bold text-accent-600">
                            {analysisResult.totalNutrition.fiber}g
                          </div>
                          <div className="text-xs font-body text-secondary-600">Fiber</div>
                        </div>
                      )}
                      {analysisResult.totalNutrition.sugar > 0 && (
                        <div className="text-center p-3 bg-red-50 rounded-2xl">
                          <div className="text-xl font-heading font-bold text-red-600">
                            {analysisResult.totalNutrition.sugar}g
                          </div>
                          <div className="text-xs font-body text-secondary-600">Sugar</div>
                        </div>
                      )}
                      {analysisResult.totalNutrition.sodium > 0 && (
                        <div className="text-center p-3 bg-secondary-50 rounded-2xl">
                          <div className="text-xl font-heading font-bold text-secondary-700">
                            {analysisResult.totalNutrition.sodium}mg
                          </div>
                          <div className="text-xs font-body text-secondary-600">Sodium</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {analysisResult.aiAnalysis && (
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-secondary-800 mb-4">AI Insights</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-secondary-50 rounded-2xl">
                        <p className="font-body text-secondary-700 mb-3">
                          {analysisResult.aiAnalysis.overallAssessment}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 text-sm font-heading font-medium rounded-full ${
                            analysisResult.aiAnalysis.nutritionalBalance === 'good' ? 'bg-primary-100 text-primary-800' :
                            analysisResult.aiAnalysis.nutritionalBalance === 'fair' ? 'bg-accent-100 text-accent-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {analysisResult.aiAnalysis.nutritionalBalance.toUpperCase()} Balance
                          </span>
                        </div>
                      </div>

                      {analysisResult.aiAnalysis.recommendations && (
                        <div>
                          <h4 className="text-base font-heading font-semibold text-secondary-800 mb-3">Recommendations</h4>
                          <div className="space-y-2">
                            {analysisResult.aiAnalysis.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-2xl shadow-soft">
                                <FiAlertCircle className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                                <span className="font-body text-secondary-700">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-secondary-200 space-y-3">
                  <button
                    onClick={() => window.location.href = '/history'}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <span>View in Meal History</span>
                    <FiTrendingUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => window.location.href = '/analytics'}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span>View Analytics</span>
                    <FiTarget className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {!analyzing && !analysisResult && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="relative">
                    <FiImage className="h-16 w-16 mx-auto mb-6 text-secondary-300" />
                    <div className="absolute inset-0 bg-secondary-300 rounded-full blur opacity-20"></div>
                  </div>
                  <p className="text-lg font-body text-secondary-500 mb-2">Upload and analyze a meal to see results here</p>
                  <p className="text-sm font-body text-secondary-400">Get detailed nutritional insights powered by AI</p>
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

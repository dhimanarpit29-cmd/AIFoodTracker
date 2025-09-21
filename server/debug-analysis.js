const { analyzeMealImage } = require('./utils/aiAnalyzer');

async function debugAnalysis() {
  try {
    const analysis = await analyzeMealImage('test.jpg');
    console.log('AI Analysis Structure:');
    console.log(JSON.stringify(analysis.aiAnalysis, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugAnalysis();

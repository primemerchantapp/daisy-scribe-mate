
// This is a mock service for demo purposes
// In a real application, you would implement actual API calls to Deepgram

export interface DeepgramResult {
  transcript: string;
  confidence: number;
}

export const transcribeAudio = async (audioBlob: Blob): Promise<DeepgramResult> => {
  // In a real application, you would call the Deepgram API here
  // For demo purposes, we're returning a mock response after a delay
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    transcript: 'Patient, Maria Santos. Date, 03/27/2025. Time, 08:30 a.m. Patient here for routine annual physical exam. No complaints today. Vital signs within normal limits. Recommended screening labs, CBC, fasting blood glucose, cholesterol panel. Patient advised on balanced diet and regular exercise. Next annual checkup scheduled for next year.',
    confidence: 0.95
  };
};

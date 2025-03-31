
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AudioRecorder from '@/components/AudioRecorder';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import ScribeOutput from '@/components/ScribeOutput';
import LoadingIndicator from '@/components/LoadingIndicator';
import { generateDocumentation } from '@/services/GeminiService';
import { saveDocumentation } from '@/services/SupabaseClient';
import { toast } from 'sonner';

const Index = () => {
  const [transcript, setTranscript] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // This function would be triggered when Deepgram finishes transcribing
  const handleTranscriptionComplete = (transcriptionText: string) => {
    setTranscript(transcriptionText);
  };
  
  // This function processes the transcript with Gemini to generate documentation
  const handleGenerateDocumentation = async (text: string) => {
    setIsProcessing(true);
    
    try {
      const generatedHtml = await generateDocumentation(text);
      setDocumentation(generatedHtml);
      
      // Extract patient name from transcript for demo purposes
      const patientNameMatch = text.match(/Patient,\s+([^.]+)/);
      const patientName = patientNameMatch ? patientNameMatch[1].trim() : 'Unknown Patient';
      
      // Save to Supabase (in a real app)
      await saveDocumentation(patientName, text, generatedHtml);
      
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast.error('Failed to generate documentation');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Add meta tag to prevent zooming on mobile
  useEffect(() => {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(metaViewport);
    
    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container max-w-3xl mx-auto pt-16 pb-8 px-4">
        <div className="my-6">
          <h1 className="text-2xl font-bold text-medical-dark mb-2">Medical Scribe AI</h1>
          <p className="text-gray-600 text-sm">
            Record or type clinical notes, and Daisy will generate comprehensive documentation
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Audio recorder component */}
          <AudioRecorder 
            onTranscriptionComplete={handleTranscriptionComplete} 
            isProcessing={isProcessing}
          />
          
          {/* Display transcript after audio is processed */}
          {transcript && (
            <TranscriptDisplay 
              transcript={transcript} 
              onSubmit={handleGenerateDocumentation}
              isProcessing={isProcessing}
            />
          )}
          
          {/* Show loading indicator while processing */}
          {isProcessing && <LoadingIndicator />}
          
          {/* Display generated documentation */}
          {documentation && !isProcessing && (
            <ScribeOutput htmlContent={documentation} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

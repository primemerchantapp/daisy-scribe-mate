
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
  isProcessing: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onTranscriptionComplete,
  isProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast.success('Recording stopped');
    }
  };
  
  const sendAudioForTranscription = async () => {
    if (!audioBlob) {
      toast.error('No audio recorded');
      return;
    }

    setIsTranscribing(true);
    
    try {
      // Mock transcription for demo purposes
      // In a real app, you would send the audioBlob to your Deepgram API
      setTimeout(() => {
        const demoTranscript = `Patient, Maria Santos. Date, 03/27/2025. Time, 08:30 a.m. Patient here for routine annual physical exam. No complaints today. Vital signs within normal limits. Recommended screening labs, CBC, fasting blood glucose, cholesterol panel. Patient advised on balanced diet and regular exercise. Next annual checkup scheduled for next year.`;
        
        onTranscriptionComplete(demoTranscript);
        setIsTranscribing(false);
        setAudioBlob(null);
        toast.success('Transcription complete');
      }, 2000);
      
      // NOTE: In a real implementation, you would use code like this:
      /*
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const data = await response.json();
      onTranscriptionComplete(data.transcript);
      */
      
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
      setIsTranscribing(false);
    }
  };

  return (
    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-medical-dark">Record Dictation</h2>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          {isRecording ? (
            <Button 
              onClick={stopRecording}
              size="lg"
              className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 animate-pulse-recording"
            >
              <MicOff className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              onClick={startRecording} 
              size="lg"
              className="w-16 h-16 rounded-full bg-medical-primary hover:bg-medical-primary/90"
              disabled={isTranscribing || isProcessing}
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        {audioBlob && !isRecording && !isTranscribing && (
          <div className="flex justify-center">
            <Button 
              onClick={sendAudioForTranscription}
              className="bg-medical-secondary hover:bg-medical-secondary/90"
              disabled={isProcessing}
            >
              <Send className="h-4 w-4 mr-2" />
              Transcribe Audio
            </Button>
          </div>
        )}
        
        {isTranscribing && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-medical-primary" />
            <span className="ml-2 text-sm text-gray-600">Transcribing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;

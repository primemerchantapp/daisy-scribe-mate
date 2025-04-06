
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Send, Pause, Stop } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Format recording time to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
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
        setRecordingTime(0);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast.info('Recording paused');
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast.info('Recording resumed');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop all audio tracks
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
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
      // Convert audioBlob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }
        
        // In a real implementation, this would call the Deepgram API
        // For demo purposes, we're using a timeout to simulate API call
        setTimeout(() => {
          const demoTranscript = `Patient, Maria Santos. Date, 03/27/2025. Time, 08:30 a.m. Patient here for routine annual physical exam. No complaints today. Vital signs within normal limits. Recommended screening labs, CBC, fasting blood glucose, cholesterol panel. Patient advised on balanced diet and regular exercise. Next annual checkup scheduled for next year.`;
          
          onTranscriptionComplete(demoTranscript);
          setIsTranscribing(false);
          setAudioBlob(null);
          toast.success('Transcription complete');
        }, 2000);
      };
      
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe audio');
      setIsTranscribing(false);
    }
  };

  return (
    <div className="px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800 font-helvetica">Record Dictation</h2>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-sm font-medium text-gray-600 font-helvetica">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center gap-4">
          {isRecording ? (
            <>
              <Button 
                onClick={pauseRecording}
                size="lg"
                className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600"
              >
                {isPaused ? <Mic className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={stopRecording}
                size="lg"
                className="w-12 h-12 rounded-full bg-black hover:bg-gray-800"
              >
                <Stop className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={startRecording} 
              size="lg"
              className="w-16 h-16 rounded-full bg-black hover:bg-gray-800"
              disabled={isTranscribing || isProcessing}
            >
              <Mic className="h-6 w-6 text-white" />
            </Button>
          )}
        </div>
        
        {audioBlob && !isRecording && !isTranscribing && (
          <div className="flex justify-center">
            <Button 
              onClick={sendAudioForTranscription}
              className="bg-black hover:bg-gray-800 text-white"
              disabled={isProcessing}
            >
              <Send className="h-4 w-4 mr-2" />
              Transcribe Audio
            </Button>
          </div>
        )}
        
        {isTranscribing && (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-black" />
            <span className="ml-2 text-sm text-gray-600 font-helvetica">Transcribing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;

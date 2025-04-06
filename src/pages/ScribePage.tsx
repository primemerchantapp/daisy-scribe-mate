
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavbar from '@/components/BottomNavbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Mic, Pause, Play, Square, Save, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { transcribeAudio } from '@/services/DeepgramService';

const ScribePage = () => {
  // State for recording and audio processing
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [fileName, setFileName] = useState('No file selected');
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);
  
  // Refs for audio elements
  const recordedAudioPlayerRef = useRef<HTMLAudioElement>(null);
  const uploadedAudioPlayerRef = useRef<HTMLAudioElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Request wake lock to prevent screen sleep
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        lock.addEventListener('release', () => {
          console.log('Wake Lock released');
          setWakeLock(null);
        });
        console.log('Wake Lock acquired');
      } catch (err) {
        console.error(`Wake Lock error: ${err}`);
      }
    } else {
      console.warn('Wake Lock API not supported');
    }
  };

  // Release wake lock
  const releaseWakeLock = async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
      } catch (err) {
        console.error(`Wake Lock release error: ${err}`);
      }
    }
  };

  // Start recording
  const startRecording = async () => {
    setTranscription('');
    setAiResponse('');
    setShowAiResponse(false);
    setIsProcessing(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Media API not supported in this browser');
      setIsProcessing(false);
      return;
    }

    try {
      toast.info('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await requestWakeLock();

      setAudioChunks([]);
      setCurrentAudioBlob(null);

      // Find supported mime types
      let options = {};
      const supportedTypes = [
        'audio/webm;codecs=opus', 'audio/ogg;codecs=opus',
        'audio/webm', 'audio/ogg', 'audio/mp4', 'audio/aac'
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          options = { mimeType: type };
          console.log(`Using mimeType: ${type}`);
          break;
        }
      }

      const recorder = new MediaRecorder(stream, options);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped');
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());

        const chunks = audioChunks;
        if (chunks.length > 0) {
          const blobType = recorder.mimeType || 'application/octet-stream';
          const audioBlob = new Blob(chunks, { type: blobType });
          
          if (audioBlob.size > 0) {
            setCurrentAudioBlob(audioBlob);
            toast.success('Recording finished');
          } else {
            setCurrentAudioBlob(null);
            toast.warning('No audio data recorded');
          }
        }
        
        setIsRecording(false);
        setIsPaused(false);
        setIsProcessing(false);
        releaseWakeLock();
      };

      recorder.onerror = (e) => {
        console.error('Recorder Error:', e);
        toast.error(`Recording error: ${(e as any).error?.name || 'Unknown error'}`);
        stream.getTracks().forEach(track => track.stop());
        setCurrentAudioBlob(null);
        setIsRecording(false);
        setIsPaused(false);
        setIsProcessing(false);
        releaseWakeLock();
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.success('Recording started');
      
    } catch (err: any) {
      console.error('Mic/start error:', err);
      
      let errorMessage = 'Microphone access error';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is busy or has a hardware error';
      }
      
      toast.error(errorMessage);
      setCurrentAudioBlob(null);
      setIsProcessing(false);
      releaseWakeLock();
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      toast.info('Recording paused');
      releaseWakeLock();
    }
  };

  // Resume recording
  const resumeRecording = async () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      await requestWakeLock();
      mediaRecorder.resume();
      setIsPaused(false);
      toast.info('Recording resumed');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      toast.info('Stopping recording...');
      mediaRecorder.stop();
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;
    
    const file = event.target.files?.[0];
    
    setTranscription('');
    setAiResponse('');
    setShowAiResponse(false);
    setCurrentAudioBlob(null);
    setAudioChunks([]);
    setIsProcessing(true);

    if (file) {
      if (!file.type || !file.type.startsWith('audio/')) {
        toast.error('Invalid file type. Please select an audio file.');
        event.target.value = '';
        setFileName('No file selected');
        setCurrentAudioBlob(null);
        setIsProcessing(false);
        return;
      }
      
      setCurrentAudioBlob(file);
      setFileName(file.name);
      toast.success('File uploaded successfully');
    } else {
      setFileName('No file selected');
    }
    
    setIsProcessing(false);
  };

  // Transcribe audio
  const handleTranscribe = async () => {
    if (!currentAudioBlob) {
      toast.error('No audio file selected or recorded to transcribe');
      return;
    }

    setIsProcessing(true);
    toast.info('Transcribing audio...');
    
    try {
      await requestWakeLock();
      
      // Use our Deepgram service
      const result = await transcribeAudio(currentAudioBlob);
      
      setTranscription(result.transcript);
      toast.success('Transcription complete!');
      
    } catch (error: any) {
      console.error('Transcription Error:', error);
      toast.error(`Transcription failed: ${error.message}`);
      setTranscription(`Error during transcription.\n\n${error.message}`);
    } finally {
      setIsProcessing(false);
      releaseWakeLock();
    }
  };

  // Play recorded audio
  const playRecordedAudio = () => {
    if (currentAudioBlob && !(currentAudioBlob instanceof File) && recordedAudioPlayerRef.current) {
      const audioURL = URL.createObjectURL(currentAudioBlob);
      recordedAudioPlayerRef.current.src = audioURL;
      recordedAudioPlayerRef.current.play()
        .then(() => toast.info('Playing recorded audio...'))
        .catch(err => {
          toast.error(`Playback error: ${err.message}`);
          URL.revokeObjectURL(audioURL);
        });

      recordedAudioPlayerRef.current.onended = () => {
        URL.revokeObjectURL(audioURL);
      };
    } else {
      toast.warning('No recorded audio available for playback');
    }
  };

  // Play uploaded audio
  const playUploadedAudio = () => {
    if (currentAudioBlob instanceof File && uploadedAudioPlayerRef.current) {
      const audioURL = URL.createObjectURL(currentAudioBlob);
      uploadedAudioPlayerRef.current.src = audioURL;
      uploadedAudioPlayerRef.current.play()
        .then(() => toast.info('Playing uploaded audio...'))
        .catch(err => {
          toast.error(`Playback error: ${err.message}`);
          URL.revokeObjectURL(audioURL);
        });

      uploadedAudioPlayerRef.current.onended = () => {
        URL.revokeObjectURL(audioURL);
      };
    } else if (audioFileInputRef.current?.files?.[0]) {
      const file = audioFileInputRef.current.files[0];
      const audioURL = URL.createObjectURL(file);
      if (uploadedAudioPlayerRef.current) {
        uploadedAudioPlayerRef.current.src = audioURL;
        uploadedAudioPlayerRef.current.play()
          .then(() => toast.info('Playing uploaded audio...'))
          .catch(err => {
            toast.error(`Playback error: ${err.message}`);
            URL.revokeObjectURL(audioURL);
          });

        uploadedAudioPlayerRef.current.onended = () => {
          URL.revokeObjectURL(audioURL);
        };
      }
    } else {
      toast.warning('No uploaded file available for playback');
    }
  };

  // Generate AI response from transcription
  const generateAIResponse = async () => {
    if (!transcription.trim()) {
      toast.warning('No transcription text available to generate note');
      return;
    }

    setIsProcessing(true);
    toast.info('Generating AI scribe note...');
    setShowAiResponse(true);
    
    try {
      await requestWakeLock();
      
      // For demo purposes, using a mock response after a delay
      setTimeout(() => {
        const mockResponse = `### **INTERNAL MEDICINE**

**SOAP Note – Internal Medicine**

**S:** Patient Maria Santos present for routine annual physical examination. Patient reports no complaints today.

**O:** Vital signs within normal limits. Physical examination was unremarkable.

**A:** Healthy adult patient presenting for annual examination.

**P:** 
- Recommended screening labs: CBC, fasting blood glucose, cholesterol panel
- Patient counseled on importance of balanced diet and regular exercise
- Next annual checkup scheduled for next year

**Insurance/Billing:**
- ICD-10: Z00.00 (Encounter for general adult medical examination without abnormal findings)
- CPT: 99395 (Periodic comprehensive preventive medicine reevaluation)
- Insurance: United Healthcare - Preventive Service Covered

### **INSURANCE COORDINATION**

**Summary:**
- Routine annual physical examination covered under preventive benefits
- Code Z00.00 (Encounter for general adult medical examination without abnormal findings)

**End of Report for: Maria Santos**

Generated by **Daisy – EMR Multi-Department Scribe System**
Developed by *Aitek PH Software*`;

        setAiResponse(mockResponse);
        toast.success('AI Scribe Note Generated!');
        setIsProcessing(false);
        releaseWakeLock();
      }, 3000);
      
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      toast.error(`AI generation failed: ${error.message}`);
      setAiResponse(`Error during AI note generation.\n\n${error.message}`);
      setIsProcessing(false);
      releaseWakeLock();
    }
  };

  // Save to database
  const saveToDatabase = () => {
    if (!aiResponse.trim()) {
      toast.warning('No AI content to save');
      return;
    }
    
    // Mock implementation
    toast.loading('Saving to database...');
    
    setTimeout(() => {
      toast.success('Scribe note saved to database!');
    }, 1500);
  };

  // Download AI content
  const downloadAIContent = () => {
    if (!aiResponse.trim()) {
      toast.warning('No AI content to download');
      return;
    }
    
    const blob = new Blob([aiResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scribe_note.txt';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  // Send email
  const sendEmail = () => {
    if (!aiResponse.trim()) {
      toast.warning('No AI content to email');
      return;
    }
    
    // Mock implementation
    toast.loading('Sending email...');
    
    setTimeout(() => {
      toast.success('Email sent successfully!');
    }, 1500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        if (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused') {
          mediaRecorder.stop();
        }
      }
      releaseWakeLock();
    };
  }, [mediaRecorder]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="container mx-auto pt-20 pb-28 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 font-helvetica">Sleek STT Transcriber & AI Scribe</h1>
          <p className="text-gray-600 font-helvetica">Record or upload audio for transcription and documentation</p>
        </div>

        <Card className="shadow-sm mb-6">
          <CardContent className="p-6 space-y-6">
            {/* Recording Controls */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording} 
                    className="w-14 h-14 rounded-full bg-black hover:bg-gray-800"
                    disabled={isProcessing}
                  >
                    <Mic size={24} className="text-white" />
                  </Button>
                ) : (
                  <>
                    {!isPaused ? (
                      <Button 
                        onClick={pauseRecording} 
                        className="w-14 h-14 rounded-full bg-black hover:bg-gray-800"
                        disabled={isProcessing}
                      >
                        <Pause size={24} className="text-white" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={resumeRecording} 
                        className="w-14 h-14 rounded-full bg-black hover:bg-gray-800"
                        disabled={isProcessing}
                      >
                        <Play size={24} className="text-white" />
                      </Button>
                    )}
                    <Button 
                      onClick={stopRecording} 
                      className="w-14 h-14 rounded-full bg-black hover:bg-gray-800"
                      disabled={isProcessing}
                    >
                      <Square size={24} className="text-white" />
                    </Button>
                  </>
                )}
              </div>

              <Button
                onClick={playRecordedAudio}
                className="bg-black hover:bg-gray-800 text-white w-full max-w-xs"
                disabled={isProcessing || isRecording || !currentAudioBlob || (currentAudioBlob instanceof File)}
              >
                <Play size={18} className="mr-2" />
                Play Recorded
              </Button>

              <div className="w-full max-w-xs">
                <label 
                  htmlFor="audioFile" 
                  className={`flex items-center justify-center gap-2 w-full py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-md cursor-pointer ${isProcessing ? 'opacity-50' : ''}`}
                >
                  <Upload size={18} />
                  Choose Audio File
                </label>
                <input
                  ref={audioFileInputRef}
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1 text-center truncate">
                  {fileName}
                </p>
              </div>

              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <Button
                  onClick={handleTranscribe}
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isProcessing || isRecording || !currentAudioBlob}
                >
                  Transcribe File/Recording
                </Button>

                <Button
                  onClick={playUploadedAudio}
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={isProcessing || !(currentAudioBlob instanceof File) || isRecording}
                >
                  <Play size={18} className="mr-2" />
                  Play Uploaded
                </Button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-center min-h-[24px]">
              {isProcessing && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                </div>
              )}
            </div>

            {/* Transcription Output */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 font-helvetica">Transcription:</label>
              <ScrollArea className="h-[200px] w-full border rounded-md bg-gray-50 p-3">
                <p className="whitespace-pre-wrap text-gray-800 font-helvetica text-sm">
                  {transcription || "Transcription will appear here..."}
                </p>
              </ScrollArea>
            </div>

            {/* Generate AI Button */}
            <Button 
              onClick={generateAIResponse}
              className="bg-black hover:bg-gray-800 text-white w-full"
              disabled={isProcessing || isRecording || !transcription.trim()}
            >
              <Save size={18} className="mr-2" />
              Generate Scribe Note
            </Button>

            {/* AI Response Output */}
            {showAiResponse && (
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 font-helvetica">AI Generated Scribe Note:</label>
                <ScrollArea className="h-[300px] w-full border rounded-md bg-gray-50 p-3">
                  <p className="whitespace-pre-wrap text-gray-800 font-helvetica text-sm">
                    {aiResponse || "AI generated note will appear here..."}
                  </p>
                </ScrollArea>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-between">
                  <Button 
                    onClick={saveToDatabase} 
                    className="bg-black hover:bg-gray-800 text-white flex-grow"
                    disabled={!aiResponse.trim()}
                  >
                    Save to DB
                  </Button>
                  <Button 
                    onClick={downloadAIContent} 
                    className="bg-black hover:bg-gray-800 text-white flex-grow"
                    disabled={!aiResponse.trim()}
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={sendEmail} 
                    className="bg-black hover:bg-gray-800 text-white flex-grow"
                    disabled={!aiResponse.trim()}
                  >
                    <Mail size={18} className="mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Hidden audio players */}
      <audio ref={recordedAudioPlayerRef} className="hidden" />
      <audio ref={uploadedAudioPlayerRef} className="hidden" />

      <BottomNavbar />
    </div>
  );
};

export default ScribePage;

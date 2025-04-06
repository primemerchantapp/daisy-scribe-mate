
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavbar from '@/components/BottomNavbar';
import AudioRecorder from '@/components/AudioRecorder';
import AudioUploader from '@/components/AudioUploader';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RefreshCw, Copy, VolumeX, Volume2, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transcribeAudio, prepareAudioForTranscription } from '@/services/DeepgramService';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const VoicePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your medical voice assistant. I can help you with medical documentation, answer clinical questions, or provide guidance on medical procedures. How can I help you today?'
    }
  ]);

  const handleTranscriptionComplete = (text: string) => {
    setTranscript(text);
  };

  const handleGenerateDocumentation = (text: string) => {
    // In a real app, this would process the transcript and generate documentation
    setIsProcessing(true);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { role: 'user', content: text }]);
    
    // Simulate processing
    setTimeout(() => {
      // Add assistant response with generated documentation
      const assistantResponse = "I've generated the following documentation based on your dictation:\n\n" +
        "PATIENT: Maria Santos\n" +
        "DATE: 03/27/2025\n" +
        "TIME: 08:30 AM\n\n" +
        "SUBJECTIVE: Patient present for routine annual physical examination. Patient reports no complaints today.\n\n" +
        "OBJECTIVE: Vital signs within normal limits.\n\n" +
        "ASSESSMENT: Healthy adult patient presenting for annual examination.\n\n" +
        "PLAN:\n" +
        "1. Recommended screening labs: CBC, fasting blood glucose, cholesterol panel\n" +
        "2. Patient counseled on importance of balanced diet and regular exercise\n" +
        "3. Next annual checkup scheduled for next year\n\n" +
        "Would you like me to make any changes to this documentation?";
      
      setConversation(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
      setIsProcessing(false);
      setTranscript('');
    }, 2000);
  };

  const handleAudioUploaded = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Prepare the audio for transcription
      const preparedAudio = await prepareAudioForTranscription(audioBlob as File);
      
      // Transcribe the audio
      const result = await transcribeAudio(preparedAudio);
      
      // Set the transcript
      setTranscript(result.transcript);
      toast.success('Audio transcribed successfully');
    } catch (error) {
      console.error('Error processing uploaded audio:', error);
      toast.error('Failed to process the audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartListening = async () => {
    setIsListening(true);
    toast.success('Voice Recognition Active');
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      handleStopListening();
    }, 5000);
  };

  const handleStopListening = async () => {
    setIsListening(false);
    setIsProcessing(true);
    
    toast.success('Processing Audio');
    
    // Simulate audio processing and transcription
    setTimeout(() => {
      // Add user message to conversation
      const userMessage = "Can you explain the standard format for a SOAP note and what each section should include?";
      setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
      
      // Simulate assistant thinking
      setTimeout(() => {
        // Add assistant response
        const assistantResponse = "SOAP notes are a standardized format for medical documentation. Here's what each section includes:\n\n" +
          "S (Subjective): This contains information obtained from the patient, including their chief complaint, history of present illness (HPI), review of systems (ROS), and any relevant past medical history. Document the patient's symptoms in their own words when possible.\n\n" +
          "O (Objective): This section includes measurable, observable data such as vital signs, physical examination findings, laboratory results, imaging studies, and any other objective assessments.\n\n" +
          "A (Assessment): Here you document your clinical impressions, diagnoses or differential diagnoses based on your subjective and objective information. This reflects your medical decision-making process.\n\n" +
          "P (Plan): This details the treatment plan, including medications prescribed, procedures performed, patient education provided, follow-up instructions, referrals, and any other interventions planned.\n\n" +
          "Would you like me to provide a specific example for a particular condition?";
        
        setConversation(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? "Audio Enabled" : "Audio Muted");
  };

  const clearConversation = () => {
    setConversation([
      {
        role: 'assistant',
        content: 'Hello! I\'m your medical voice assistant. I can help you with medical documentation, answer clinical questions, or provide guidance on medical procedures. How can I help you today?'
      }
    ]);
    toast.success('Conversation Cleared');
  };

  const copyConversation = () => {
    const text = conversation.map(msg => `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <main className="container mx-auto pt-20 pb-28 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 font-helvetica">Voice Assistant</h1>
          <p className="text-gray-600 font-helvetica">Interact with your AI medical assistant using voice or text</p>
        </div>
        
        <Tabs defaultValue="dictation" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dictation" className="font-helvetica">Dictation</TabsTrigger>
            <TabsTrigger value="assistant" className="font-helvetica">Voice Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dictation" className="mt-4 space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-helvetica">Audio Transcription</CardTitle>
                <CardDescription className="font-helvetica">Record or upload audio to transcribe</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="record">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="record" className="w-1/2 font-helvetica">Record</TabsTrigger>
                    <TabsTrigger value="upload" className="w-1/2 font-helvetica">Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="record">
                    <AudioRecorder 
                      onTranscriptionComplete={handleTranscriptionComplete}
                      isProcessing={isProcessing}
                    />
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <AudioUploader 
                      onAudioUploaded={handleAudioUploaded}
                      isProcessing={isProcessing}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {transcript && (
              <TranscriptDisplay 
                transcript={transcript} 
                onSubmit={handleGenerateDocumentation}
                isProcessing={isProcessing}
              />
            )}
          </TabsContent>
          
          <TabsContent value="assistant">
            <Card className="shadow-sm">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold font-helvetica">Voice Conversation</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute} className="text-black">
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={clearConversation} className="text-black">
                      <RefreshCw size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={copyConversation} className="text-black">
                      <Copy size={18} />
                    </Button>
                  </div>
                </div>
                <CardDescription className="font-helvetica">Ask medical questions or dictate notes</CardDescription>
              </CardHeader>
              
              <CardContent className="p-4">
                <ScrollArea className="h-[350px] pr-4 overflow-y-auto">
                  <div className="space-y-4">
                    {conversation.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-black text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="whitespace-pre-line font-helvetica">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="p-4 flex justify-center">
                <Button 
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  className={`rounded-full h-16 w-16 flex items-center justify-center ${
                    isListening ? "bg-red-600" : "bg-black"
                  }`}
                  onClick={isListening ? handleStopListening : handleStartListening}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold font-helvetica">Voice Commands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base font-helvetica">Document Creation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ul className="text-sm space-y-1 list-disc list-inside text-gray-700 font-helvetica">
                      <li>"Create a new SOAP note for patient..."</li>
                      <li>"Start a progress note for follow-up..."</li>
                      <li>"Generate a consultation report..."</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-base font-helvetica">Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <ul className="text-sm space-y-1 list-disc list-inside text-gray-700 font-helvetica">
                      <li>"What are the symptoms of..."</li>
                      <li>"Explain the treatment options for..."</li>
                      <li>"What are the side effects of..."</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default VoicePage;

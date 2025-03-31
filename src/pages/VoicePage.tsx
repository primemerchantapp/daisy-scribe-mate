
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavbar from '@/components/BottomNavbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RefreshCw, Copy, VolumeX, Volume2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { transcribeAudio } from '@/services/DeepgramService';
import { toast } from '@/hooks/use-toast';

const VoicePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your medical voice assistant. I can help you with medical documentation, answer clinical questions, or provide guidance on medical procedures. How can I help you today?'
    }
  ]);

  const handleStartListening = async () => {
    setIsListening(true);
    // In a real implementation, this would connect to the device's microphone
    // and start recording audio
    
    toast({
      title: "Voice Recognition Active",
      description: "I'm listening to you now...",
    });
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      handleStopListening();
    }, 5000);
  };

  const handleStopListening = async () => {
    setIsListening(false);
    setIsProcessing(true);
    
    toast({
      title: "Processing Audio",
      description: "Analyzing what you said...",
    });
    
    // Simulate audio processing and transcription
    setTimeout(async () => {
      try {
        // In a real implementation, we would pass the actual audio recording to transcribeAudio
        const audioBlob = new Blob([]); // Empty blob for demo
        const mockTranscriptionResult = await transcribeAudio(audioBlob);
        
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
        
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process audio. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    }, 3000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Audio Enabled" : "Audio Muted",
      description: isMuted ? "You will now hear voice responses" : "Voice responses are now muted",
    });
  };

  const clearConversation = () => {
    setConversation([
      {
        role: 'assistant',
        content: 'Hello! I\'m your medical voice assistant. I can help you with medical documentation, answer clinical questions, or provide guidance on medical procedures. How can I help you today?'
      }
    ]);
    toast({
      title: "Conversation Cleared",
      description: "Started a new conversation",
    });
  };

  const copyConversation = () => {
    const text = conversation.map(msg => `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The entire conversation has been copied",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto pt-20 pb-24 px-4 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Voice Assistant</h1>
          <p className="text-gray-600">Interact with your AI medical assistant using voice commands</p>
        </div>
        
        <Card className="mb-6 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Voice Conversation</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={clearConversation}>
                  <RefreshCw size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={copyConversation}>
                  <Copy size={18} />
                </Button>
              </div>
            </div>
            <CardDescription>Ask medical questions or dictate notes</CardDescription>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
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
          </CardContent>
          
          <Separator />
          
          <CardFooter className="p-4 flex justify-center">
            <Button 
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-16 w-16 flex items-center justify-center"
              onClick={isListening ? handleStopListening : handleStartListening}
              disabled={isProcessing}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Voice Commands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base">Document Creation</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>"Create a new SOAP note for patient..."</li>
                  <li>"Start a progress note for follow-up..."</li>
                  <li>"Generate a consultation report..."</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>"What are the symptoms of..."</li>
                  <li>"Explain the treatment options for..."</li>
                  <li>"What are the side effects of..."</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base">Template Usage</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>"Use the cardiology template for..."</li>
                  <li>"Apply the pediatric well visit format..."</li>
                  <li>"Format this as a discharge summary..."</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-base">System Commands</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <ul className="text-sm space-y-1 list-disc list-inside text-gray-700">
                  <li>"Save this conversation"</li>
                  <li>"Clear the current session"</li>
                  <li>"Send this to the patient chart"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <BottomNavbar />
    </div>
  );
};

export default VoicePage;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface AudioUploaderProps {
  onAudioUploaded: (blob: Blob) => void;
  isProcessing: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioUploaded, isProcessing }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const audioFile = files[0];
    
    // Check if the file is an audio file
    if (!audioFile.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    setIsUploading(true);

    try {
      // Pass the blob to the parent component
      onAudioUploaded(audioFile);
      toast.success('Audio file uploaded successfully');
    } catch (error) {
      console.error('Error processing audio file:', error);
      toast.error('Failed to process the audio file');
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label 
        htmlFor="audio-upload"
        className={`
          flex flex-col items-center justify-center
          w-full h-32 
          border-2 border-dashed 
          rounded-lg 
          cursor-pointer 
          bg-gray-50 
          hover:bg-gray-100 
          transition-colors
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-black" />
          <p className="mb-2 text-sm text-gray-500 font-helvetica">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 font-helvetica">
            MP3, WAV or M4A (max. 10MB)
          </p>
        </div>
        <input 
          id="audio-upload" 
          type="file" 
          accept="audio/*" 
          className="hidden"
          onChange={handleFileChange}
          disabled={isProcessing || isUploading}
        />
      </label>

      {isUploading && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 font-helvetica">Uploading audio...</p>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;

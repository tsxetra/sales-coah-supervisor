import { useState, useRef, useCallback } from 'react';
// FIX: The 'LiveSession' type is not exported from "@google/genai".
import { GoogleGenAI, Modality } from "@google/genai";

// Helper functions for audio encoding
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const useAudioRecorder = (onStop: (fullTranscript: string) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    // FIX: The 'LiveSession' type is not exported. Using 'any' as a workaround.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const currentInputTranscriptionRef = useRef('');

    const stopRecording = useCallback(() => {
        if (!isRecording) return;
        setIsRecording(false);

        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }

        const finalTranscript = currentInputTranscriptionRef.current;
        onStop(finalTranscript);
        currentInputTranscriptionRef.current = '';

    }, [isRecording, onStop]);


    const startRecording = useCallback(async () => {
        if (isRecording) return;

        if (!process.env.API_KEY) {
            alert("API_KEY is not configured.");
            return;
        }

        setIsRecording(true);
        setTranscript('');
        currentInputTranscriptionRef.current = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // FIX: Cast window to 'any' to access 'webkitAudioContext' without a TypeScript error. This is a common pattern for browser compatibility.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            
            const scriptProcessor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => console.log('Live session opened.'),
                    onclose: () => console.log('Live session closed.'),
                    onerror: (e) => console.error('Live session error:', e),
                    onmessage: (msg) => {
                        if (msg.serverContent?.inputTranscription) {
                            const text = msg.serverContent.inputTranscription.text;
                            // FIX: The 'isFinal' property does not exist on the Transcription object.
                            // According to the Gemini API guidelines, text should be appended as it streams in.
                            currentInputTranscriptionRef.current += text;
                            setTranscript(currentInputTranscriptionRef.current);
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                },
            });

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                    int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                    data: encode(new Uint8Array(int16.buffer)),
                    mimeType: 'audio/pcm;rate=16000',
                };

                if (sessionPromiseRef.current) {
                    sessionPromiseRef.current.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    }).catch(console.error);
                }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current.destination);

        } catch (error) {
            console.error('Failed to start recording:', error);
            setIsRecording(false);
            alert('Could not start recording. Please ensure you have given microphone permissions.');
        }
    }, [isRecording]);

    return { isRecording, transcript, startRecording, stopRecording };
};

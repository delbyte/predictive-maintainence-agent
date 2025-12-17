declare module 'react-speech-recognition' {
    export interface ListenOptions {
        continuous?: boolean;
        language?: string;
        interimResults?: boolean;
    }

    export interface SpeechRecognitionResult {
        transcript: string;
        listening: boolean;
        resetTranscript: () => void;
        browserSupportsSpeechRecognition: boolean;
        isMicrophoneAvailable?: boolean;
        finalTranscript?: string;
        interimTranscript?: string;
    }

    export function useSpeechRecognition(): SpeechRecognitionResult;

    const SpeechRecognition: {
        startListening: (options?: ListenOptions) => Promise<void>;
        stopListening: () => void;
        abortListening: () => void;
        getRecognition: () => SpeechRecognition | null;
    };

    export default SpeechRecognition;
}

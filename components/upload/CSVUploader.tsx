'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CSVUploaderProps {
    onUpload: (file: File) => void;
    loading: boolean;
}

export default function CSVUploader({ onUpload, loading }: CSVUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file: File) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setError('Invalid file format. Please upload a standard CSV file.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('File size exceeds 5MB limit.');
            return false;
        }
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const uploadedFile = e.dataTransfer.files[0];
            if (validateFile(uploadedFile)) {
                setFile(uploadedFile);
                onUpload(uploadedFile);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const uploadedFile = e.target.files[0];
            if (validateFile(uploadedFile)) {
                setFile(uploadedFile);
                onUpload(uploadedFile);
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleChange}
                disabled={loading}
            />

            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "relative group cursor-pointer border-2 border-dashed rounded-lg p-8 transition-all duration-300 flex flex-col items-center justify-center text-center",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-[#27272a] bg-[#0c0c0e] hover:border-zinc-500 hover:bg-[#18181b]",
                        loading && "opacity-50 pointer-events-none"
                    )}
                >
                    <div className="w-10 h-10 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-300">
                        Drop CSV file
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">
                        Click to browse or drag file here. Max size 5MB.
                    </p>

                    {error && (
                        <div className="absolute inset-x-0 bottom-2 text-center">
                            <span className="text-[10px] text-red-500 font-medium bg-red-500/10 px-2 py-0.5 rounded">
                                {error}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#27272a] flex items-center justify-center shrink-0">
                        {loading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <FileSpreadsheet className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-zinc-200 truncate">{file.name}</p>
                            <button onClick={clearFile} disabled={loading} className="text-zinc-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 flex-1 bg-[#27272a] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: loading ? "60%" : "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">
                                {(file.size / 1024).toFixed(0)}KB
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

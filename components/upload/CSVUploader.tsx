'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CSVUploaderProps {
    onUpload: (file: File) => void;
    loading?: boolean;
}

export default function CSVUploader({ onUpload, loading }: CSVUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.csv')) {
                setSelectedFile(file);
                onUpload(file);
            } else {
                alert('Please upload a CSV file');
            }
        }
    }, [onUpload]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onUpload(file);
        }
    }, [onUpload]);

    return (
        <div className="w-full">
            <motion.div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                animate={{
                    borderColor: dragActive ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: dragActive ? 'rgba(94, 106, 210, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                }}
                className={`
                    relative w-full h-32 rounded-xl border border-dashed transition-all duration-300
                    flex flex-col items-center justify-center cursor-pointer group hover:border-border-highlight
                `}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept=".csv"
                    disabled={loading}
                />

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                            <p className="text-xs text-foreground-muted">Processing Data...</p>
                        </motion.div>
                    ) : selectedFile ? (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-3 bg-surface-highlight px-4 py-2 rounded-lg border border-border"
                        >
                            <span className="text-xl">📄</span>
                            <div className="text-left">
                                <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                                <p className="text-[10px] text-foreground-muted">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedFile(null);
                                }}
                                className="p-1 hover:bg-white/10 rounded-full"
                            >
                                ✕
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 mb-3 rounded-full bg-surface-highlight flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg opacity-60">📥</span>
                            </div>
                            <p className="text-sm font-medium text-foreground mb-1">Upload Vehicle Data</p>
                            <p className="text-xs text-foreground-muted">Drag & drop CSV or click to browse</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30 rounded-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30 rounded-br opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
        </div>
    );
}

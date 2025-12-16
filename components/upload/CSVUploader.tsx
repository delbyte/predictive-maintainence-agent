'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';

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
                className={`
          relative border-2 border-dashed rounded-lg p-12 text-center
          transition-colors cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}
          ${loading ? 'opacity-50 pointer-events-none' : ''}
        `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                />

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>

                    {selectedFile ? (
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-lg font-medium text-gray-900">
                                Drop your CSV file here
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                or click to browse
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-600">Analyzing...</span>
                        </div>
                    )}
                </div>
            </motion.div>

            <p className="text-xs text-gray-500 mt-2 text-center">
                Upload a CSV file containing vehicle sensor data for analysis
            </p>
        </div>
    );
}

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Types for the component
interface QRCodeGeneratorScannerProps {
    defaultSize?: number;
    defaultBgColor?: string;
    defaultFgColor?: string;
}

interface ScanResult {
    data: string;
    timestamp: Date;
    format?: string;
}

const QRCodeGeneratorScanner: React.FC<QRCodeGeneratorScannerProps> = ({
    defaultSize = 256,
    defaultBgColor = '#FFFFFF',
    defaultFgColor = '#000000'
}) => {
    // State for QR Code Generation
    const [qrData, setQrData] = useState<string>('https://example.com');
    const [qrSize, setQrSize] = useState<number>(defaultSize);
    const [qrBgColor, setQrBgColor] = useState<string>(defaultBgColor);
    const [qrFgColor, setQrFgColor] = useState<string>(defaultFgColor);
    const [includeLogo, setIncludeLogo] = useState<boolean>(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    // State for QR Code Scanning
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scanResults, setScanResults] = useState<ScanResult[]>([]);
    const [cameraError, setCameraError] = useState<string>('');

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize QR Code library
    useEffect(() => {
        // Dynamically import QR Code library
        const loadQRCode = async () => {
            try {
                await import('qrcode');
            } catch (error) {
                console.error('Failed to load QR Code library:', error);
            }
        };
        loadQRCode();
    }, []);

    // Handle logo file selection
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Generate QR Code
    const generateQRCode = async () => {
        try {
            const QRCode = await import('qrcode');
            const canvas = document.createElement('canvas');

            // Generate basic QR code
            await QRCode.toCanvas(canvas, qrData, {
                width: qrSize,
                margin: 2,
                color: {
                    dark: qrFgColor,
                    light: qrBgColor
                },
                errorCorrectionLevel: 'H' // High error correction for logo inclusion
            });

            // If logo is included, draw it on the QR code
            if (includeLogo && logoPreview) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const logoSize = qrSize * 0.2; // Logo size is 20% of QR code
                    const logoX = (qrSize - logoSize) / 2;
                    const logoY = (qrSize - logoSize) / 2;

                    const logoImg = new Image();
                    logoImg.src = logoPreview;

                    await new Promise((resolve) => {
                        logoImg.onload = () => {
                            // Draw white background for logo
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

                            // Draw logo
                            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                            resolve(null);
                        };
                    });
                }
            }

            // Replace the QR code display
            const qrDisplay = document.getElementById('qr-code-display');
            if (qrDisplay) {
                qrDisplay.innerHTML = '';
                qrDisplay.appendChild(canvas);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('Error generating QR code. Please check your input.');
        }
    };

    // Download QR Code in high quality
    const downloadQRCode = async () => {
        try {
            // Find the canvas element containing the QR code
            const qrContainer = document.getElementById('qr-code-display');
            if (!qrContainer) {
                alert('Please generate a QR code first');
                return;
            }

            // Get the canvas element (either directly or the first child canvas)
            let canvas: HTMLCanvasElement | null = null;

            // Check if the container itself is a canvas
            if (qrContainer.tagName === 'CANVAS') {
                canvas = qrContainer as HTMLCanvasElement;
            } else {
                // Look for canvas inside the container
                canvas = qrContainer.querySelector('canvas');
            }

            if (!canvas) {
                alert('No QR code found. Please generate one first.');
                return;
            }

            // Create a higher resolution version
            const scale = 4; // 4x scaling for high quality
            const scaledCanvas = document.createElement('canvas');
            const ctx = scaledCanvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Set scaled dimensions
            scaledCanvas.width = canvas.width * scale;
            scaledCanvas.height = canvas.height * scale;

            // Apply scaling
            ctx.scale(scale, scale);

            // Set background color
            ctx.fillStyle = qrBgColor;
            ctx.fillRect(0, 0, scaledCanvas.width / scale, scaledCanvas.height / scale);

            // Draw the original QR code
            ctx.drawImage(canvas, 0, 0);

            // If there's a logo, we need to redraw it at higher resolution
            if (includeLogo && logoPreview) {
                const logoSize = (canvas.width * scale) * 0.2; // 20% of scaled size
                const logoX = (scaledCanvas.width - logoSize) / 2;
                const logoY = (scaledCanvas.height - logoSize) / 2;

                // Draw white background for logo at high resolution
                ctx.fillStyle = '#FFFFFF';
                const bgPadding = 5 * scale;
                ctx.fillRect(
                    logoX / scale - bgPadding / scale,
                    logoY / scale - bgPadding / scale,
                    (logoSize + 2 * bgPadding) / scale,
                    (logoSize + 2 * bgPadding) / scale
                );

                // Draw logo at high resolution
                const logoImg = new Image();
                logoImg.crossOrigin = 'anonymous';
                logoImg.src = logoPreview;

                await new Promise((resolve, reject) => {
                    logoImg.onload = () => {
                        ctx.drawImage(logoImg, logoX / scale, logoY / scale, logoSize / scale, logoSize / scale);
                        resolve(null);
                    };
                    logoImg.onerror = reject;
                });
            }

            // Create download link
            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.png`;
            link.href = scaledCanvas.toDataURL('image/png', 1.0); // Highest quality PNG
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('Error downloading QR code. Please try again.');
        }
    };

    // Start scanning
    // Start scanning
    const startScanning = async () => {
        try {
            setCameraError('');
            setIsScanning(true);

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Prefer rear camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play().catch(error => {
                            console.error('Error playing video:', error);
                            setCameraError('Unable to play video stream.');
                            stopScanning();
                        });
                    }
                };
                streamRef.current = stream;

                // Start scanning loop after a brief delay to let video initialize
                setTimeout(() => {
                    if (isScanning) {
                        scanLoop();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Camera error:', error);
            setCameraError(
                error instanceof Error && error.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera permissions.'
                    : error instanceof Error && error.name === 'NotFoundError'
                        ? 'No camera found. Please connect a camera.'
                        : 'Unable to access camera. Please check your camera permissions.'
            );
            setIsScanning(false);
        }
    };

    // Update the scanLoop function to check video readiness
    const scanLoop = () => {
        if (!isScanning || !videoRef.current || !canvasRef.current) return;

        // Check if video is ready
        if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            requestAnimationFrame(scanLoop);
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (!ctx || video.videoWidth === 0) {
                requestAnimationFrame(scanLoop);
                return;
            }

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Continue scanning
            requestAnimationFrame(scanLoop);
        } catch (error) {
            console.error('Scan loop error:', error);
        }
    };

    // Stop scanning
    const stopScanning = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsScanning(false);
    };

    // Scanning loop using jsQR library
    // const scanLoop = async () => {
    //     if (!isScanning || !videoRef.current || !canvasRef.current) return;

    //     try {
    //         // Dynamically import jsQR
    //         const jsQR = (await import('jsqr')).default;

    //         const video = videoRef.current;
    //         const canvas = canvasRef.current;
    //         const ctx = canvas.getContext('2d');

    //         if (!ctx) return;

    //         // Draw video frame to canvas
    //         canvas.width = video.videoWidth;
    //         canvas.height = video.videoHeight;
    //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    //         // Get image data
    //         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //         // Scan for QR code
    //         const code = jsQR(imageData.data, imageData.width, imageData.height, {
    //             inversionAttempts: 'dontInvert',
    //         });

    //         if (code) {
    //             // Add to scan results if not a duplicate
    //             const newScanResult: ScanResult = {
    //                 data: code.data,
    //                 timestamp: new Date(),
    //                 format: 'QR_CODE'
    //             };

    //             setScanResults(prev => {
    //                 // Check for duplicates in last 2 seconds
    //                 const isDuplicate = prev.some(result =>
    //                     result.data === code.data &&
    //                     new Date().getTime() - result.timestamp.getTime() < 2000
    //                 );

    //                 if (!isDuplicate) {
    //                     return [newScanResult, ...prev.slice(0, 4)]; // Keep last 5 results
    //                 }
    //                 return prev;
    //             });
    //         }

    //         // Continue scanning
    //         if (isScanning) {
    //             requestAnimationFrame(scanLoop);
    //         }
    //     } catch (error) {
    //         console.error('Scan error:', error);
    //     }
    // };

    // Clear scan results
    const clearScanResults = () => {
        setScanResults([]);
    };

    // Copy QR data to clipboard
    const copyQRData = () => {
        navigator.clipboard.writeText(qrData)
            .then(() => alert('QR data copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    };

    // Predefined templates
    const applyTemplate = (template: 'url' | 'email' | 'phone' | 'wifi' | 'contact') => {
        const templates = {
            url: 'https://example.com',
            email: 'mailto:contact@example.com',
            phone: 'tel:+1234567890',
            wifi: 'WIFI:S:MyNetwork;T:WPA;P:MyPassword;;',
            contact: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
        };
        setQrData(templates[template]);
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="qr-generator-scanner">
            <div className="container">
                <h1>QR Code Generator & Scanner</h1>

                <div className="grid">
                    {/* QR Code Generator Section */}
                    <div className="section">
                        <h2>Generate QR Code</h2>

                        <div className="form-group">
                            <label htmlFor="qrData">QR Code Content:</label>
                            <textarea
                                id="qrData"
                                value={qrData}
                                onChange={(e) => setQrData(e.target.value)}
                                rows={4}
                                placeholder="Enter text, URL, or other data for QR code"
                            />

                            <div className="button-group">
                                <button onClick={copyQRData} className="secondary">
                                    Copy Content
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Quick Templates:</label>
                            <div className="template-buttons">
                                <button onClick={() => applyTemplate('url')} className="template-btn">
                                    Website URL
                                </button>
                                <button onClick={() => applyTemplate('email')} className="template-btn">
                                    Email
                                </button>
                                <button onClick={() => applyTemplate('phone')} className="template-btn">
                                    Phone
                                </button>
                                <button onClick={() => applyTemplate('wifi')} className="template-btn">
                                    WiFi
                                </button>
                                <button onClick={() => applyTemplate('contact')} className="template-btn">
                                    Contact
                                </button>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="qrSize">Size:</label>
                                <input
                                    type="range"
                                    id="qrSize"
                                    min="128"
                                    max="1024"
                                    step="32"
                                    value={qrSize}
                                    onChange={(e) => setQrSize(parseInt(e.target.value))}
                                />
                                <span>{qrSize}px</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="qrBgColor">Background:</label>
                                <input
                                    type="color"
                                    id="qrBgColor"
                                    value={qrBgColor}
                                    onChange={(e) => setQrBgColor(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="qrFgColor">Foreground:</label>
                                <input
                                    type="color"
                                    id="qrFgColor"
                                    value={qrFgColor}
                                    onChange={(e) => setQrFgColor(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={includeLogo}
                                    onChange={(e) => setIncludeLogo(e.target.checked)}
                                />
                                Include Logo
                            </label>

                            {includeLogo && (
                                <div className="logo-upload">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleLogoUpload}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="secondary"
                                    >
                                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                    </button>

                                    {logoPreview && (
                                        <div className="logo-preview">
                                            <img src={logoPreview} alt="Logo preview" />
                                            <button onClick={() => {
                                                setLogoPreview('');
                                                setLogoFile(null);
                                            }} className="remove-logo">
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button onClick={generateQRCode} className="primary">
                                Generate QR Code
                            </button>
                            <button onClick={downloadQRCode} className="success" disabled={!qrData}>
                                Download High Quality
                            </button>
                        </div>

                        <div className="qr-display" ref={qrCodeRef}>
                            <div id="qr-code-display" style={{
                                minHeight: `${qrSize}px`,
                                minWidth: `${qrSize}px`,
                                backgroundColor: qrBgColor,
                                padding: '10px',
                                borderRadius: '8px'
                            }}></div>
                        </div>
                    </div>

                    {/* QR Code Scanner Section */}
                    <div className="section">
                        <h2>Scan QR Code</h2>

                        <div className="scanner-controls">
                            {!isScanning ? (
                                <button onClick={startScanning} className="primary">
                                    Start Camera Scanner
                                </button>
                            ) : (
                                <button onClick={stopScanning} className="danger">
                                    Stop Scanner
                                </button>
                            )}

                            {scanResults.length > 0 && (
                                <button onClick={clearScanResults} className="secondary">
                                    Clear Results
                                </button>
                            )}
                        </div>

                        <div className="scanner-preview">
                            {isScanning ? (
                                <div className="video-container">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted // Added for browser compatibility
                                        style={{
                                            width: '100%',
                                            maxWidth: '500px',
                                            border: '2px solid #333',
                                            borderRadius: '8px',
                                            transform: 'scaleX(-1)' // Mirror the video for more natural feel
                                        }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="scan-overlay">
                                        <div className="scan-frame"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="placeholder">
                                    <p>Camera feed will appear here when scanning</p>
                                    <p className="hint">Make sure to allow camera permissions when prompted</p>
                                </div>
                            )}
                        </div>

                        {cameraError && (
                            <div className="error-message">
                                {cameraError}
                            </div>
                        )}

                        <div className="scanner-preview">
                            {isScanning ? (
                                <div className="video-container">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        style={{
                                            width: '100%',
                                            maxWidth: '500px',
                                            border: '2px solid #333',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="scan-overlay">
                                        <div className="scan-frame"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="placeholder">
                                    <p>Camera feed will appear here when scanning</p>
                                </div>
                            )}
                        </div>

                        <div className="scan-results">
                            <h3>Scan Results ({scanResults.length})</h3>

                            {scanResults.length === 0 ? (
                                <p className="empty-results">No scans yet. Point your camera at a QR code to scan.</p>
                            ) : (
                                <div className="results-list">
                                    {scanResults.map((result, index) => (
                                        <div key={index} className="result-item">
                                            <div className="result-header">
                                                <span className="timestamp">
                                                    {result.timestamp.toLocaleTimeString()}
                                                </span>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(result.data)}
                                                    className="copy-btn"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <div className="result-data">
                                                {result.data.length > 100
                                                    ? `${result.data.substring(0, 100)}...`
                                                    : result.data}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .qr-generator-scanner {
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        
        .section {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          color: #444;
          margin-top: 0;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #555;
        }
        
        textarea, input[type="text"], input[type="range"] {
          width: 100%;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        
        textarea:focus, input[type="text"]:focus {
          outline: none;
          border-color: #4a90e2;
        }
        
        .form-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .form-row .form-group {
          flex: 1;
          min-width: 150px;
        }
        
        .button-group, .action-buttons, .scanner-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .primary {
          background: #4a90e2;
          color: white;
        }
        
        .primary:hover {
          background: #357ae8;
        }
        
        .secondary {
          background: #f0f0f0;
          color: #333;
        }
        
        .secondary:hover {
          background: #e0e0e0;
        }
        
        .success {
          background: #28a745;
          color: white;
        }
        
        .success:hover {
          background: #218838;
        }
        
        .danger {
          background: #dc3545;
          color: white;
        }
        
        .danger:hover {
          background: #c82333;
        }
        
        .template-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .template-btn {
          padding: 8px 12px;
          background: #e9ecef;
          border: 1px solid #ced4da;
          color: #495057;
        }
        
        .template-btn:hover {
          background: #dee2e6;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .logo-upload {
          margin-top: 10px;
        }
        
        .logo-preview {
          position: relative;
          display: inline-block;
          margin-top: 10px;
        }
        
        .logo-preview img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border: 2px solid #ddd;
          border-radius: 4px;
        }
        
        .remove-logo {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          padding: 0;
          border-radius: 50%;
          background: #dc3545;
          color: white;
          font-size: 16px;
          line-height: 1;
        }
        
        .qr-display {
          margin-top: 20px;
          text-align: center;
        }
        
        .scanner-preview {
          margin: 20px 0;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .video-container {
          position: relative;
        }
        
        .scan-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .scan-frame {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          border: 2px solid #4a90e2;
          box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
        }
        
        .placeholder {
          padding: 40px;
          text-align: center;
          color: #6c757d;
        }
        
        .error-message {
          padding: 10px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 6px;
          margin: 10px 0;
        }
        
        .scan-results {
          margin-top: 20px;
        }
        
        .results-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .result-item {
          padding: 12px;
          margin-bottom: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 4px solid #4a90e2;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .timestamp {
          font-size: 12px;
          color: #6c757d;
        }
        
        .copy-btn {
          padding: 4px 8px;
          font-size: 12px;
        }
        
        .result-data {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          word-break: break-all;
        }
        
        .empty-results {
          text-align: center;
          color: #6c757d;
          padding: 20px;
        }
      `}</style>
        </div>
    );
};

export default QRCodeGeneratorScanner;
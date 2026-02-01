import React, { useState, useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const QRCodeGenerator: React.FC = () => {
  const [buyerName, setBuyerName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('NGN'); // Default to Naira
  const [qrValue, setQrValue] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = () => {
    // Basic validation
    if (!buyerName.trim() || !location.trim() || !price.trim()) {
      alert('Please fill in Buyer Name, Location, and Price.');
      return;
    }

    const formattedPrice = new Intl.NumberFormat('en-US').format(Number(price));

    const data = [
      `Buyer: ${buyerName.trim()}`,
      `Location: ${location.trim()}`,
      `Price: ${currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : '€'} ${formattedPrice}`,
      `Date: ${new Date().toISOString().split('T')[0]}`, // Auto-add current date
    ].join('\n');

    setQrValue(data);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `receipt-qr-${buyerName || 'unnamed'}.png`;
      link.click();
    } else {
      console.error('Canvas not ready');
    }
  };

  return (
    <div style={{ 
      maxWidth: '480px', 
      margin: '0 auto', 
      padding: '24px', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
        Receipt QR Code Generator
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label>
          Buyer Name
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="e.g. Solomon Adebayo"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Ikeja, Lagos"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ flex: 1 }}>
            Price
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 45000"
              min="0"
              step="1"
              style={{ width: '100%', padding: '10px', marginTop: '6px' }}
            />
          </label>

          <label style={{ flex: '0 0 100px' }}>
            Currency
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '6px' }}
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        style={{
          width: '100%',
          padding: '14px',
          margin: '24px 0 32px',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Generate QR Code
      </button>

      {qrValue && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'inline-block',
            marginBottom: '24px',
          }}>
            <QRCode
              ref={canvasRef}
              value={qrValue}
              size={400}
              level="H"
              includeMargin={true}
            />
          </div>

          <pre style={{
            background: '#f5f5f5',
            padding: '16px',
            borderRadius: '6px',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            marginBottom: '24px',
          }}>
            {qrValue}
          </pre>

          <button
            onClick={handleDownload}
            style={{
              padding: '12px 32px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Download High-Quality PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
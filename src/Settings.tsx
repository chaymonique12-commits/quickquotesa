import { useState, useRef } from 'react';
import { Camera, User, Percent, Calendar, FileText, Palette } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useAppStore } from '../stores/appStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const ACCENT_COLORS = [
  { name: 'Orange', value: '#E85D04' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
];

export function Settings() {
  const { settings, updateBusiness, updateSettings } = useSettingsStore();
  const { showToast } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        updateBusiness({ logo: base64 });
        setIsUploading(false);
        showToast('Logo uploaded!', 'success');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-4 md:max-w-2xl md:ml-64">
        <h1 className="font-heading font-bold text-xl text-text-primary mb-4">Settings</h1>
        
        {/* Business Profile */}
        <div className="bg-surface rounded-card border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-semibold text-text-primary font-heading">Business Profile</span>
          </div>
          <div className="p-4 space-y-4">
            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-card overflow-hidden flex items-center justify-center">
                {settings.business.logo ? (
                  <img src={settings.business.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-text-secondary/50" />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-text-secondary mt-1">Max 200x200px, JPEG</p>
              </div>
            </div>
            
            <Input
              label="Business Name"
              value={settings.business.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBusiness({ name: e.target.value })}
              placeholder="Your Business Name"
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={settings.business.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBusiness({ phone: e.target.value })}
              placeholder="082 123 4567"
            />
            
            <Input
              label="Email"
              type="email"
              value={settings.business.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBusiness({ email: e.target.value })}
              placeholder="you@business.co.za"
            />
            
            <Input
              label="Address"
              value={settings.business.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBusiness({ address: e.target.value })}
              placeholder="123 Main Street, Johannesburg"
            />
          </div>
        </div>
        
        {/* Quote Settings */}
        <div className="bg-surface rounded-card border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-semibold text-text-primary font-heading">Quote Settings</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-xs text-text-secondary font-medium flex items-center gap-1 mb-1">
                <Percent className="w-3 h-3" />
                Default VAT Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={(settings.defaultVatRate * 100).toFixed(0)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ defaultVatRate: parseFloat(e.target.value) / 100 })}
                  min="0"
                  max="100"
                  className="w-20 h-10 px-2 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <span className="text-text-secondary">%</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-text-secondary font-medium flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                Quote Validity Period
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.defaultValidityDays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSettings({ defaultValidityDays: parseInt(e.target.value) || 30 })}
                  min="1"
                  className="w-20 h-10 px-2 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
                <span className="text-text-secondary">days</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-text-secondary font-medium flex items-center gap-1 mb-1">
                <FileText className="w-3 h-3" />
                Default Notes / Terms
              </label>
              <textarea
                value={settings.defaultNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateSettings({ defaultNotes: e.target.value })}
                placeholder="Payment terms, warranty info..."
                rows={3}
                className="w-full px-3 py-2 rounded-card border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Personalization */}
        <div className="bg-surface rounded-card border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <span className="font-semibold text-text-primary font-heading">Personalization</span>
          </div>
          <div className="p-4">
            <label className="text-xs text-text-secondary font-medium block mb-2">Accent Color</label>
            <div className="flex gap-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ accentColor: color.value })}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    settings.accentColor === color.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* App Info */}
        <div className="text-center text-sm text-text-secondary py-4">
          <p className="font-heading font-semibold text-text-primary">QuickQuote SA</p>
          <p>Quote it. Send it. Close it.</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
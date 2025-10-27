'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Sticker, StickerPack, StickersConfig } from '@/types/sticker';

interface StickerPickerProps {
  onStickerSelect: (sticker: Sticker) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function StickerPicker({ onStickerSelect, isOpen, onClose }: StickerPickerProps) {
  const [stickerPacks, setStickerPacks] = useState<StickerPack[]>([]);
  const [activePack, setActivePack] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStickers();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadStickers = async () => {
    try {
      setError(null);
      
      // TODO: Replace with API call when ready
      // const response = await fetch('/api/stickers');
      // const data = await response.json();
      // setStickerPacks(data.packs);
      
      // Current: Load from public assets
      const response = await fetch('/stickers/stickers-config.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load stickers: ${response.status}`);
      }
      
      const config: StickersConfig = await response.json();
      setStickerPacks(config.packs);
      
      if (config.packs.length > 0) {
        setActivePack(config.packs[0].id);
      }
    } catch (error) {
      console.error('Failed to load stickers:', error);
      setError('Failed to load stickers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activePackData = stickerPacks.find(pack => pack.id === activePack);
  
  const filteredStickers = activePackData?.stickers.filter(sticker =>
    searchTerm === '' || 
    sticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sticker.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
      <div className="bg-background border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md sm:mx-4 max-h-[80vh] sm:max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Stickers</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading stickers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={loadStickers}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stickers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Pack Tabs */}
            <div className="p-4 pb-2">
              <ScrollArea className="w-full">
                <div className="flex space-x-2 pb-2">
                  {stickerPacks.map((pack) => (
                    <Button
                      key={pack.id}
                      variant={activePack === pack.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivePack(pack.id)}
                      className="whitespace-nowrap text-xs"
                    >
                      {pack.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Sticker Grid */}
            <ScrollArea className="flex-1 px-4 pb-4">
              {filteredStickers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'No stickers found' : 'No stickers available'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {filteredStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => onStickerSelect(sticker)}
                      className="aspect-square p-2 hover:bg-muted rounded-lg transition-colors group"
                      title={sticker.name}
                    >
                      <img
                        src={sticker.thumbnail}
                        alt={sticker.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}
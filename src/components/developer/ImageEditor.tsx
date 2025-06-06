
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onSave: (editedFile: File) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  imageFile,
  onSave
}) => {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [zoom, setZoom] = useState(100);
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imgSrc, setImgSrc] = useState('')

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const generateCanvas = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    ctx.imageSmoothingQuality = 'high'

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    )
  }, [completedCrop, brightness, contrast, saturation])

  React.useEffect(() => {
    generateCanvas()
  }, [generateCanvas])

  const handleSave = useCallback(() => {
    if (!canvasRef.current || !completedCrop) {
      return
    }

    canvasRef.current.toBlob(
      (blob) => {
        if (blob && imageFile) {
          const editedFile = new File([blob], imageFile.name, {
            type: 'image/png',
          })
          onSave(editedFile)
          onClose()
        }
      },
      'image/png',
      0.9
    )
  }, [completedCrop, imageFile, onSave, onClose])

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setZoom(100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Redigera Bild</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {imgSrc && (
            <div className="flex flex-col items-center space-y-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Zoom:</Label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={50}
                    max={200}
                    step={5}
                    className="w-32"
                  />
                  <span className="text-sm font-medium w-12">{zoom}%</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="overflow-hidden border rounded-lg" style={{ maxHeight: '400px', maxWidth: '100%' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Beskär"
                    src={imgSrc}
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center',
                      maxHeight: 'none',
                      maxWidth: 'none'
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Ljusstyrka: {brightness}%</Label>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={50}
                max={150}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Kontrast: {contrast}%</Label>
              <Slider
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                min={50}
                max={150}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Mättnad: {saturation}%</Label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                min={0}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Preview Canvas */}
          {completedCrop && (
            <div className="flex justify-center">
              <div className="text-center">
                <Label>Förhandsvisning:</Label>
                <div className="mt-2">
                  <canvas
                    ref={canvasRef}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      maxWidth: '200px',
                      maxHeight: '200px'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Återställ Alla
            </Button>
            
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Avbryt
              </Button>
              <Button onClick={handleSave} disabled={!completedCrop}>
                Spara Ändringar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

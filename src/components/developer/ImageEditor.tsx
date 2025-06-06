
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
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

  const generatePreviewCanvas = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return
    }

    const image = imgRef.current
    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size to match the crop
    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    ctx.imageSmoothingQuality = 'high'

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    // Draw the cropped image with filters applied
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }, [completedCrop, brightness, contrast, saturation])

  React.useEffect(() => {
    generatePreviewCanvas()
  }, [generatePreviewCanvas])

  const handleSave = useCallback(() => {
    if (!previewCanvasRef.current || !completedCrop || !imageFile) {
      console.error('Missing required elements for saving:', {
        canvas: !!previewCanvasRef.current,
        crop: !!completedCrop,
        file: !!imageFile
      });
      return
    }

    // Generate the final edited image
    previewCanvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          console.log('Generated blob:', {
            size: blob.size,
            type: blob.type
          });
          
          const editedFile = new File([blob], imageFile.name, {
            type: 'image/png',
            lastModified: Date.now(),
          })
          
          console.log('Created edited file:', {
            name: editedFile.name,
            size: editedFile.size,
            type: editedFile.type
          });
          
          onSave(editedFile)
          onClose()
        } else {
          console.error('Failed to create blob from canvas');
        }
      },
      'image/png',
      1.0 // Use maximum quality
    )
  }, [completedCrop, imageFile, onSave, onClose])

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
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
                    maxHeight: '400px',
                    maxWidth: '100%'
                  }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
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
                    ref={previewCanvasRef}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '50%',
                      maxWidth: '200px',
                      maxHeight: '200px',
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={resetFilters}>
              Återställ Filter
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

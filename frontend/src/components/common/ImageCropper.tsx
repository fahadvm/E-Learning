'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import getCroppedImg from '@/utils/cropImage';

interface CropperModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const CropperModal: React.FC<CropperModalProps> = ({ image, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage as string);
      onClose();
    } catch (error) {
      console.error('Crop failed', error);
    }
  };

  return (
    <Modal
      isOpen={!!image}
      onRequestClose={onClose}
      contentLabel="Crop Image"
      ariaHideApp={false}
      className="bg-white p-4 rounded-lg w-full max-w-xl mx-auto mt-24 shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
    >
      <div className="relative w-full h-96">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button  onClick={onClose}>Cancel</button>
        <button onClick={handleDone}>Crop & Save</button>
      </div>
    </Modal>
  );
};

export default CropperModal;

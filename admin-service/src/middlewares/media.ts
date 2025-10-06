import multer from 'multer'

const mediaStorage = multer.memoryStorage();

export const uploadFile = multer({storage: mediaStorage}).single('file');
export const uploadMultipleFiles = multer({storage: mediaStorage}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]);
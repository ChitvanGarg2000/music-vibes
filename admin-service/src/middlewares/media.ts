import multer from 'multer'

const mediaStorage = multer.memoryStorage();

const uploadFile = multer({storage: mediaStorage}).single('file');

export default uploadFile
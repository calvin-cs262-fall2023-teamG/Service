const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

const containerName = 'image';
const blobService = new BlobServiceClient(
  'https://calvinchaptercache.blob.core.windows.net/?sp=racwdli&st=2023-11-28T01:41:02Z&se=2023-11-28T09:41:02Z&spr=https&sv=2022-11-02&sr=c&sig=KBcMcpdQia7lRa45wenJjGzoBtcMCt93Y7WaWULXjv8%3D',
);

async function handleImageUpload(imagePath) {
  const imageName = 'image_m.jpg'; // Generate a unique image name
  try {
    const buffer = fs.readFileSync(imagePath);

    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    const options = { blobHTTPHeaders: { blobContentType: 'application/octet-stream' } };

    console.log('Uploading image blob...');
    const uploadResponse = await blockBlobClient.uploadData(buffer, options);

    console.log('Blob uploaded successfully:', uploadResponse);
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Usage example:
handleImageUpload('./file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FChapterCache-454cf27a-0fcd-4025-a4b8-ac2aa55206ce/ImagePicker/945b8d44-2425-4078-99ae-d1020630be11.jpeg').then((result) => {
  console.log('Uploaded image URL:', result);
}).catch((error) => {
  console.error('Upload failed:', error);
});

import {v2 as cloudinary} from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Cloudinary env vars missing:', {
    cloudName: Boolean(cloudName),
    apiKey: Boolean(apiKey),
    apiSecret: Boolean(apiSecret),
  })
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
})

console.log('Cloudinary config loaded', {
  cloudName,
  apiKeySet: Boolean(apiKey),
  apiSecretSet: Boolean(apiSecret),
})

export default cloudinary;





export const uploadImg = async (base64DataURI, quality = 'auto') => {    
    const uploadUrl = `https://api.cloudinary.com/v1_1/dyyv2kv1x/image/upload`;
    const formData = new FormData();
    formData.append('file', base64DataURI);
    formData.append('upload_preset', 'Siwes_Logbook');
    formData.append('quality', quality)

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data.secure_url
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
        return {error: "image upload failed"}
    }
}
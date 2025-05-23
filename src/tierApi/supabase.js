import { createClient } from '@supabase/supabase-js';

// Create Supabase client
export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const uploadSpotImage = async (file) => {
  if (!file) {
    console.log("uploadSpotImage: No file provided.");
    return null;
  }

  const filePath = `public/${Date.now()}-${file.name}`;
  console.log(`uploadSpotImage: Uploading to filePath: ${filePath}`);

  try {
    const { data, error: uploadError } = await supabase.storage
      .from('spot-images') // This is your bucket name
      .upload(filePath, file, {
        cacheControl: '3600', // Cache image for 1 hour
        upsert: false, // false to prevent overwrite if file with same name exists
      });

    if (uploadError) {
      console.error('Error uploading image to Supabase Storage:', uploadError.message);
      return null; // Return null on upload error
    }

    if (data) {
      // After successful upload, get the public URL.
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('spot-images')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error getting public URL:', urlError.message);
        // Even if upload worked, if we can't get URL, treat as failure for this flow
        return null; 
      }
      
      console.log('Successfully uploaded image. Public URL:', publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    }
    // Fallback if data is unexpectedly null (should ideally be covered by error)
    console.warn("uploadSpotImage: Upload may have succeeded but no data path returned from Supabase.");
    return null;
  } catch (error) {
    // Catch any other synchronous errors or issues
    console.error('Exception during image upload process:', error.message);
    return null;
  }
};

import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

// Create Supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Generic image upload function
export const uploadImage = async (
  file,
  type = "spot", // "spot" or "workplace"
  name = "",
  secondaryInfo = "" // country for spots, type for workplaces
) => {
  if (!file) return null;

  // Create filename based on type
  const extension = file.name.split(".").pop().toLowerCase();
  const nameSlug = slugify(name, {
    lower: true,
    strict: true,
    replacement: "_",
  });
  const secondarySlug = slugify(secondaryInfo, {
    lower: true,
    strict: true,
    replacement: "_",
  });

  const filename =
    nameSlug && secondarySlug
      ? `${nameSlug}_${secondarySlug}.${extension}`
      : `${type}_${Date.now()}.${extension}`;

  const filePath = `public/${filename}`;

  // Determine bucket name based on type
  const bucketName = type === "workplace" ? "workplace-images" : "spot-images";

  try {
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(`${type} image upload failed:`, error.message);
    return null;
  }
};

import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

// Create Supabase client
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const uploadSpotImage = async (
  file,
  spotName = "",
  spotCountry = ""
) => {
  if (!file) return null;

  // Create filename from spot name and country
  const extension = file.name.split(".").pop().toLowerCase();
  const nameSlug = slugify(spotName, {
    lower: true,
    strict: true,
    replacement: "_",
  });
  const countrySlug = slugify(spotCountry, {
    lower: true,
    strict: true,
    replacement: "_",
  });

  const filename =
    nameSlug && countrySlug
      ? `${nameSlug}_${countrySlug}.${extension}`
      : `spot_${Date.now()}.${extension}`;

  const filePath = `public/${filename}`;

  try {
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from("spot-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("spot-images").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Image upload failed:", error.message);
    return null;
  }
};

const cloudName = "elcaxymt";
const uploadPreset = "logement221";

export async function uploadToCloudinary(file) {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  return data.secure_url;
}
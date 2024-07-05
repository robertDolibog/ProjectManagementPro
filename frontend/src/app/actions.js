"use server";

// actions.tsx server actions

export async function uploadFileServerAction(formData) {
  console.log("Uploading file...");
  // TODO: save the image from formData and return a correct URL
  // for now, we're returning a placeholder image
  return "https://placehold.co/600x400/EEE/31343C";
}

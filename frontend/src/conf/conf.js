const conf = {
  appwriteUrl: import.meta.env.VITE_APPWRITE_URL || "",
  appwriteProjectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "",
  appwriteBucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID || "",
  backendBaseUrl: import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000",
};
export default conf;

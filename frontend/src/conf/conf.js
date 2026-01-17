const conf  = {
  appwriteUrl : String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_PROJECT_ID),
  appwriteBucketId: String(import.meta.env.VITE_BUCKET_ID),
  backendBaseUrl: String(import.meta.env.VITE_BACKEND_BASE_URL)
}
export default conf;
import conf from "../conf/conf";

import { Client, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://<REGION>.cloud.appwrite.io/v1')
    .setProject(conf.appwriteProjectId);

const storage = new Storage(client);



class Service{
    async uploadFile(file){
        try {
            return await storage.createFile({
    bucketId: conf.appwriteBucketId,
    fileId: ID.unique(),
    file: file
});
        } catch (error) {
            console.log("appwrite file service :: upload file",error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            const result = await storage.deleteFile({
    bucketId: conf.appwriteBucketId,
    fileId: fileId
});
        } catch (error) {
            console.log("appwrite file error::delete::",error);
        }
    }

    getFilePreview(fileId){
        try {
            return storage.getFilePreview({
                bucketId: appwriteBucketId,
    fileId: fileId,
            })
        } catch (error) {
            
        }
    }
}
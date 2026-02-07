import conf from "../conf/conf.js";

import { Client, Storage, ID } from "appwrite";
import api from "./api";

class Service {
  client = new Client();
  bucket;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
    this.bucket = new Storage(this.client);
  }
  // post Service

  async createPost({ title, slug, content, featuredImage, status }) {
    const res = await api.post("/blogs/posts", {
      title,
      slug,
      content,
      featuredImage,
      status,
    });
    console.log("article created", res);
    return res;
  }

  async updatePost(oldslug, { title, content, featuredImage, status, tags, slug:newslug }) {
    const res = await api.put(`/blogs/posts/${oldslug}`, {
      title,
      content,
      featuredImage,
      status,
      tags,
      slug:newslug,
    });
    console.log("updated aricle", res.data);
    return res.data;
  }

  async deletePost(slug) {
try {
      const res = await api.delete(`/blogs/posts/${slug}`);
      console.log("delted article", res);
      return res;
} catch (error) {
  console.log("article could not be delted",error);
}
  }

  async getPost(slug) {
    try {
      const res = await api.get(`/blogs/posts/${slug}`);
      console.log("got your post in config", res.data);
      return res.data;
    } catch (error) {
      console.log("error getting your post", error);
    }
  }

  async incrementView(slug) {
    try {
      const res = await api.post(`/blogs/posts/${slug}/view`);
      return res.data;
    } catch (error) {
      console.log("error incrementing view", error);
    }
  }

  async getMyPost(slug) {
    try {
      const res = await api.get(`/blogs/posts/my/${slug}`);
      return res.data;
    } catch (error) {
      console.log("error getting your post", error);
    }
  }

  async getPosts({ sort, order } = {}) {
    try {
      const res = await api.get("/blogs/posts", {
        params: {
          sort,
          order,
        },
      });
      
      return res;
    } catch (error) {
      console.log("could not fetch posts from backend", error);
    }
  }

  async getMyPosts() {
    try {
      const res = await api.get("/blogs/posts/my");
      return res;
    } catch (error) {
      console.log("could not fetch my posts from backend", error);
    }
  }

  async getPendingPosts() {
    try {
      const res = await api.get("/blogs/posts/pending");
      return res;
    } catch (error) {
      console.log("could not fetch pending posts from backend", error);
    }
  }

  async submitForReview(slug) {
    try {
      const res = await api.post(`/blogs/posts/${slug}/submit`);
      return res;
    } catch (error) {
      console.log("could not submit post for review", error);
    }
  }

  async reviewPost(slug, { action, rejectionReason }) {
    try {
      const res = await api.patch(`/blogs/posts/${slug}/review`, {
        action,
        rejectionReason,
      });
      return res;
    } catch (error) {
      console.log("could not review post", error);
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      const result = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    console.log("this is the result while uploading image",result);
    return result;
    } catch (error) {
      console.log("appwrite file service :: upload file", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    console.log("file id received while delting file in config.js",fileId);
    try {
     const result =  await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId,
     );
      console.log("result received while deleting a image",result);
      return result;
    } catch (error) {
      console.log("appwrite file error::delete::", error);
      return false;
    }
  }

  getFilePreview(fileId) {
     
try {
        const result =  this.bucket.getFileView(
          conf.appwriteBucketId,
          fileId,
        );
        console.log("getting file preview this was the result",result);
        return result;
} catch (error) {
  console.log("error getting file preview",error);
}
    
  }

  async updateFile(file,oldFileId){
     console.log("file received while uploading a file",file);
     try {
       await this.deleteFile(oldFileId);
       const newFile = await this.uploadFile(file);
       return newFile;
     } catch (error) {
       console.log("error updating file", error);
     }
  }
}

const service = new Service();
export default service;

import { useForm } from "react-hook-form";
import Button from "../Button.jsx";
import Input from "../Input.jsx";
import Select from "../Select.jsx";

import RTE from "../RTE.jsx";

import appwriteService from "../../psappwrite/config.js";

import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";

function PostForm({ post }) {
  const [iamgeId,setImageId] = useState(post ? appwriteService.getFilePreview(post.featuredImage) : null);
 
  console.log("post form loaded");
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
     const imagechanged = watch("image");
     
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  console.log("received user data in post form from state", userData);
  console.log("received post int post form",post)
  const submit = async (data) => {
    console.log("data received in form in post form",data)
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      console.log("image received and prepared to be uploaded in POSTFORM:-", file);
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }
       
      const dbPost = await appwriteService.updatePost(post.slug, {
        title:data.title,
        slug:data.slug,content:data.content,status:data.status,
        featuredImage: file ? file.$id : undefined,
      });
      console.log("dbPost received", dbPost);
      // useSelector(state=>{
      //   state.auth.userData = 
      // })
      if (dbPost) {
        navigate(`/post/${dbPost._id}`);
      }
    } else {
      // check wetehr this file shold be checked or not
     // no post exits as of now
      const file = await appwriteService.uploadFile(data.image[0]);
      if (file) {
        const fileId = file.$id ? file.$id : undefined;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          title:data.title,slug:data.slug,content:data.content,featuredImage:fileId,status:data.status
        });
        if (dbPost) {
          navigate(`/post/${dbPost._id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    const imagefile = watch("image");
    console.log("image file",imagefile);

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);
  return (
    <form onSubmit={handleSubmit(submit)} className="glass-card mesh-border grid gap-6 rounded-3xl p-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Input
          label="Title"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title?.message && (
          <p className="text-xs text-slate-300">{errors.title.message}</p>
        )}
        <Input
          label="Slug"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: "Slug is required" })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        {errors.slug?.message && (
          <p className="text-xs text-slate-300">{errors.slug.message}</p>
        )}
        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{
            required: "Content is required",
            validate: (value) => {
              const plainText = value
                ?.replace(/<[^>]*>/g, " ")
                .replace(/&nbsp;/g, " ")
                .trim();
              return plainText ? true : "Content is required";
            },
          }}
          error={errors.content?.message}
        />
      </div>
      <div className="space-y-4">
        <Input
          label="Featured Image"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", {
            required: post ? false : "Featured image is required",
          })}
        />
        {errors.image?.message && (
          <p className="text-xs text-slate-300">{errors.image.message}</p>
        )}
        {post && (
          <div className="w-full mb-4 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={imagechanged ? imagechanged[0] ?  URL.createObjectURL(imagechanged[0]): appwriteService.getFilePreview(post.featuredImage):null }
              alt={post.title}
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
export default PostForm;

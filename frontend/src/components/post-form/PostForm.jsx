import { useForm } from "react-hook-form"
import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router"

import Button from "../Button.jsx"
import Input from "../Input.jsx"
import Select from "../Select.jsx"
import RTE from "../RTE.jsx"
import appwriteService from "../../psappwrite/config.js"

function PostForm({ post }) {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "draft",
      tags: post?.tags?.join(", ") || "",
    },
  })

  const imageChanged = watch("image")

  const submit = async (data) => {
    if (post) {
      const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null

      if (file) appwriteService.deleteFile(post.featuredImage)

      const dbPost = await appwriteService.updatePost(post.slug, {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        featuredImage: file ? file.$id : undefined,
      })

      if (dbPost) {
        if (data.status === "submit") {
          await appwriteService.submitForReview(dbPost.slug || data.slug)
          navigate("/panel")
        } else {
          navigate(`/post/${dbPost._id}`)
        }
      }
    } else {
      const file = await appwriteService.uploadFile(data.image[0])
      if (!file) return

      const dbPost = await appwriteService.createPost({
        title: data.title,
        slug: data.slug,
        content: data.content,
        featuredImage: file.$id,
        status: data.status,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      })

      if (dbPost) {
        if (data.status === "submit") {
          await appwriteService.submitForReview(data.slug)
          navigate("/panel")
        } else {
          navigate(`/post/${dbPost._id}`)
        }
      }
    }
  }

  const slugTransform = useCallback((value) => {
    if (!value || typeof value !== "string") return ""
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d\s]+/g, "-")
      .replace(/\s+/g, "-")
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="surface-card grid gap-6 rounded-3xl p-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div>
          <Input label="Title" placeholder="Post title" {...register("title", { required: "Title is required" })} />
          {errors.title?.message && <p className="mt-1 text-xs text-red-300">{errors.title.message}</p>}
        </div>

        <div>
          <Input
            label="Slug"
            placeholder="post-slug"
            {...register("slug", { required: "Slug is required" })}
            onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
          />
          {errors.slug?.message && <p className="mt-1 text-xs text-red-300">{errors.slug.message}</p>}
        </div>

        <RTE
          label="Content"
          name="content"
          control={control}
          defaultValue={getValues("content")}
          rules={{
            required: "Content is required",
            validate: (value) => {
              const plain = value?.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim()
              return plain ? true : "Content is required"
            },
          }}
          error={errors.content?.message}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Input
            label="Featured image"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", {
              required: post ? false : "Featured image is required",
            })}
          />
          {errors.image?.message && <p className="mt-1 text-xs text-red-300">{errors.image.message}</p>}
        </div>

        {post && (
          <div className="overflow-hidden rounded-xl border border-[var(--border-soft)]">
            <img
              src={imageChanged?.[0] ? URL.createObjectURL(imageChanged[0]) : appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
          </div>
        )}

        <div>
          <Input label="Tags" placeholder="graphql, api, rest" {...register("tags")} />
          <p className="mt-1 text-xs text-muted">Separate tags with commas</p>
        </div>

        <Select label="Status" options={["draft", "submit"]} {...register("status", { required: true })} />

        <Button type="submit" className="w-full">
          {post ? "Update post" : "Submit post"}
        </Button>
      </div>
    </form>
  )
}

export default PostForm

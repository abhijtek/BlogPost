import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Controller } from "react-hook-form"

export default function RTE({ name, control, label, defaultValue = "", rules, error }) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 inline-block text-xs font-semibold tracking-wide text-muted">{label}</label>}

      <div className="input-glass overflow-hidden rounded-xl">
        <Controller
          name={name || "content"}
          control={control}
          rules={rules}
          render={({ field: { onChange } }) => (
            <Editor
              apiKey="n2gab5o2eh38o6rvk9xnom1v7bvtdj0d7ghk8acoioveom4q"
              initialValue={defaultValue}
              init={{
                height: 500,
                skin: "oxide-dark",
                content_css: "dark",
                menubar: true,
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image link | removeformat | help",
                content_style:
                  "body { font-family: Inter Tight, Segoe UI, sans-serif; font-size:14px; color:#e6edf3; background:#0f141c; line-height:1.8; }",
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  )
}

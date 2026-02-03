import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';


export default function RTE({name, control, label, defaultValue =""}) {
  return (
    <div className='w-full'> 
    {label && <label className="mb-2 inline-block text-sm font-semibold text-slate-200">{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        apiKey='n2gab5o2eh38o6rvk9xnom1v7bvtdj0d7ghk8acoioveom4q'
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
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
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family: 'Manrope', Helvetica, Arial, sans-serif; font-size:14px; color:#e6e7eb; background:#141417; }"
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}

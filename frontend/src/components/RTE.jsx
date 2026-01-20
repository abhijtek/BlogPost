import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
function RTE() {
  return (
    <Editor
    initialValue='default value'
    init = {
        {
            branding:false,
            height: 500,
            menubar: true,
            plugins:[
                'advlist autolink lists image charmap prin preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
            'undo redo ....'
        }
    }
    />
  )
}

export default RTE
import React, { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { Video } from './Video'
import { createVideo, getVideo, updateVideo } from './VideoService'

import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'path'

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const VideoForm = () => {
  const navigate = useNavigate()
  const params = useParams()

  const initialState = {
    title: '',
    description: '',
    url: ''
  }

  const [video, setVideo] = useState<Video>(initialState)

  const [formData, setFormData] = useState({
    title: '',
    btnText: ''
  })

  const getVideoById = async (id: string) => {
    const res = await getVideo(id)
    const {title, description, url} = res.data
    setVideo({
      title: title,
      description: description,
      url: url
    })
  }

  useEffect(() => {
    if (params.id) {
      getVideoById(params.id)
      setFormData({title: 'Update Video', btnText: 'Update'})
    } else {
      setFormData({title: 'New Video', btnText: 'Create'})
    }
  }, [params])

  const handleInputChange = (e: InputChange) => {
    setVideo({...video, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (params.id) {
        const res = await updateVideo(params.id, video)
        toast.success('Video updated')
        setVideo(res.data)
      } else {
        const res = await createVideo(video)
        toast.success('Video added')
        setVideo(initialState)
      }
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
            <h3>{formData.title}</h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input 
                  type="text" 
                  name='title' 
                  placeholder='Write a title for the new video' 
                  className='form-control' 
                  onChange={handleInputChange}
                  value={video.title}
                  autoFocus
                />
              </div>
              <div className="input-group mb-3">
                <input 
                  type="url" 
                  name='url' 
                  placeholder='https://somesite.com' 
                  className='form-control'
                  onChange={handleInputChange}
                  value={video.url}
                />
              </div>
              <div className="input-group mb-3">
                <textarea 
                  name="description" 
                  rows={3} 
                  className='form-control' 
                  placeholder='Write a description'
                  onChange={handleInputChange}
                  value={video.description}
                ></textarea>
              </div>
              <button className='btn btn-primary'>
                {formData.btnText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoForm
import { CloseOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Colors } from '@renderer/constants/Colors'
import { useUploadImage } from '@renderer/features/full-screen/services/projects/uploadImage.service'
import {
  Button,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps
} from 'antd'
import { RcFile } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { useCreateProject, useUpdateProject } from '@renderer/features/full-screen/services/projects/project.service'
import { Project, ProjectCreate, ProjectStatus } from '@renderer/features/full-screen/services/projects/project.type'
import { getImageUrl } from '@renderer/utils'

const { Option } = Select

const statusOptions = [
  { value: ProjectStatus.PLANING, label: 'Planning' },
  { value: ProjectStatus.DEVELOPMENT, label: 'Development' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.MAINTENANCE, label: 'Maintenance' },
  { value: ProjectStatus.HOLDING, label: 'Holding' },
  { value: ProjectStatus.FINISHED, label: 'Finished' }
]

interface ProjectModelProps {
  isOpen: boolean
  onClose: () => void
  data?: Project | null
}

interface ProjectFormValues {
  projectName: string
  memberCount: number
  color: string | { metaColor: { r: number; g: number; b: number; a: number } }
  status: ProjectStatus
  imageUrl: string
  imageId: string
  projectFileLink: string
}

export const ProjectModel: React.FC<ProjectModelProps> = ({ isOpen, onClose, data }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null)
  const { mutateAsync: createProject, isPending: isSubmitting } = useCreateProject()
  const { mutateAsync: updateProject, isPending: isUpdating } = useUpdateProject()
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage()

  // Reset form when data changes
  useEffect(() => {
    if (isOpen) {
      if (data) {
        // Edit mode - populate form with existing data
        form.setFieldsValue({
          projectName: data.name,
          memberCount: data.member_count,
          color: data.color,
          status: data.status,
          imageUrl: data.image?.url || '',
          imageId: data.image?.id ? String(data.image.id) : '',
          projectFileLink: data.project_file_url || ''
        })

        if (data.image?.url) {
          const loadImage = async (): Promise<void> => {
            try {
              const imageUrl = await getImageUrl(data.image.url)
              setPreviewImage(imageUrl)
            } catch (error) {
              console.error('Failed to load image:', error)
              setPreviewImage(null)
            }
          }
          loadImage()
          setUploadedImageId(String(data.image.id))
        } else {
          setPreviewImage(null)
          setUploadedImageId(null)
        }
      } else {
        // Create mode - reset form
        form.resetFields()
        setFileList([])
        setPreviewImage(null)
        setUploadedImageId(null)
      }
    }
  }, [data, isOpen, form])

  const handleImageChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList)
    if (newFileList.length > 0) {
      const file = newFileList[0]
      if (file.originFileObj) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            if (img.width > 500 || img.height > 500) {
              message.error('Image dimensions must be 500x500 pixels or smaller')
              setFileList([])
              setPreviewImage(null)
              return
            }
            setPreviewImage(e.target?.result as string)

            // Upload the image when selected
            uploadImage(
              {
                file: file.originFileObj as File
              },
              {
                onSuccess: (response) => {
                  if (response.data) {
                    // Update form with the new image URL and store the image ID
                    form.setFieldsValue({
                      imageUrl: response.data.url,
                      imageId: response.data.id
                    })
                    setUploadedImageId(response.data.id)
                    message.success('Image uploaded successfully')
                  }
                },
                onError: () => {
                  message.error('Failed to upload image')
                  setFileList([])
                  setPreviewImage(null)
                  setUploadedImageId(null)
                }
              }
            )
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(file.originFileObj as RcFile)
      }
    } else {
      setPreviewImage(null)
    }
  }

  const uploadButton = (
    <div>
      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const handleSubmit = async (values: ProjectFormValues): Promise<void> => {
    try {
      const projectData: ProjectCreate = {
        name: values.projectName,
        member_count: values.memberCount,
        color:
          typeof values.color === 'string'
            ? values.color
            : `#${values.color.metaColor.r.toString(16).padStart(2, '0')}${values.color.metaColor.g.toString(16).padStart(2, '0')}${values.color.metaColor.b.toString(16).padStart(2, '0')}`,
        status: values.status,
        image_id: uploadedImageId ? Number(uploadedImageId) : null,
        project_file_url: values.projectFileLink
      }

      if (data) {
        // Edit mode - include the project ID
        await updateProject({
          id: data.id,
          projectData
        })
        message.success('Project updated successfully')
      } else {
        // Create mode
        await createProject(projectData)
        message.success('Project created successfully')
      }

      form.resetFields()
      setFileList([])
      setPreviewImage(null)
      setUploadedImageId(null)
      onClose()
    } catch (error) {
      console.error('Error saving project:', error)
      message.error(`Failed to ${data ? 'update' : 'create'} project`)
    }
  }

  return (
    <Modal
      title={
        <span
          style={{
            fontFamily: 'Skyer',
            color: Colors.primary,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
        >
          {data ? 'Edit Project' : 'Create New Project'}
        </span>
      }
      centered
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting || isUploading || isUpdating}
          onClick={() => form.submit()}
        >
          {data ? 'Update Project' : 'Create Project'}
        </Button>
      ]}
      closeIcon={<CloseOutlined style={{ color: Colors.light }} />}
      width={400}
      styles={{
        content: {
          backgroundColor: Colors.darkGreen,
          color: Colors.light,
          borderRadius: '8px',
          padding: '24px'
        },
        header: {
          backgroundColor: Colors.darkGreen,
          borderBottom: `1px solid ${Colors.muted}`,
          paddingBottom: '16px',
          marginBottom: '16px'
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          memberCount: 1,
          status: ProjectStatus.PLANING,
          color: '#1890ff'
        }}
      >
        <Form.Item name="imageUrl" label="Project Image">
          <Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={() => false} // Prevent default upload
            onChange={handleImageChange}
            fileList={fileList}
          >
            {previewImage ? (
              <img src={previewImage} alt="Project" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="projectName"
          label={<span style={{ color: Colors.light }}>Project Name</span>}
          rules={[{ required: true, message: 'Please input project name!' }]}
          style={{ color: Colors.light }}
        >
          <Input
            placeholder="Enter project name"
            style={{
              backgroundColor: Colors.light,
              color: Colors.darkGreen,
              borderColor: Colors.muted
            }}
          />
        </Form.Item>

        <Form.Item
          name="projectFileLink"
          label={<span style={{ color: Colors.light }}>Project File Link</span>}
          rules={[{ required: true, message: 'Please input project file link!' }]}
          style={{ color: Colors.light }}
        >
          <Input
            placeholder="Enter project file link"
            style={{
              backgroundColor: Colors.light,
              color: Colors.darkGreen,
              borderColor: Colors.muted
            }}
          />
        </Form.Item>

        <Form.Item
          name="memberCount"
          label={<span style={{ color: Colors.light }}>Number of Members</span>}
          rules={[{ required: true, message: 'Please input number of members!' }]}
        >
          <InputNumber
            min={0}
            style={{
              width: '100%',
              backgroundColor: Colors.light,
              color: Colors.darkGreen
            }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span style={{ color: Colors.light }}>Status</span>}
          rules={[{ required: true }]}
        >
          <Select
            style={{ width: '100%' }}
            dropdownStyle={{
              backgroundColor: Colors.darkGreen,
              color: Colors.light,
              border: `1px solid ${Colors.muted}`
            }}
            className="custom-select"
            dropdownRender={(menu) => <div style={{ padding: '4px 0' }}>{menu}</div>}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="color"
          label={<span style={{ color: Colors.light }}>Project Color</span>}
          rules={[{ required: true }]}
        >
          <ColorPicker
            showText
            style={{ width: '100%' }}
            format="hex"
            onChangeComplete={(color) => {
              // Update the form value with the hex string
              form.setFieldsValue({ color: color.toHexString() })
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

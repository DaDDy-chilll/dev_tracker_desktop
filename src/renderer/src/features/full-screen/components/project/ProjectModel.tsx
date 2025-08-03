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
import { useState } from 'react'
import { useCreateProject } from '../../services'
import { ProjectCreate, ProjectStatus } from '../../services/projects/project.type'

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
}

interface ProjectFormValues {
  projectName: string
  memberCount: number
  color: string | { metaColor: { r: number; g: number; b: number; a: number } }
  status: ProjectStatus
  imageUrl: string
  imageId: string
}

export const ProjectModel: React.FC<ProjectModelProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null)
  const { mutateAsync: createProject, isPending: isSubmitting } = useCreateProject()
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage()

  const handleImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
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
        color: values.color as string,
        status: values.status,
        image_id: uploadedImageId ? Number(uploadedImageId) : null
      }

      await createProject(projectData)
      message.success('Project created successfully')
      form.resetFields()
      setFileList([])
      setPreviewImage(null)
      setUploadedImageId(null)
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
      message.error('Failed to create project')
    }
  }

  return (
    <Modal
      title={
        <span
          style={{
            fontFamily: 'Skyer',
            color: Colors.primary,
            fontSize: '20px'
          }}
        >
          Create New Project
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
          loading={isSubmitting || isUploading}
          onClick={() => form.submit()}
        >
          Create Project
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
          status: ProjectStatus.PLANING,
          color: '#000000',
          memberCount: 0
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

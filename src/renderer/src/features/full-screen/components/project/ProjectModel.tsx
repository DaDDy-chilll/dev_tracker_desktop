import { Colors } from '@renderer/constants/Colors'
import { Upload, X } from 'lucide-react'
import { JSX, useState } from 'react'
import Modal from 'react-modal'
import { PulseLoader } from 'react-spinners'
import { useCreateProject } from '../../services'
import { ProjectCreate, ProjectStatus } from '../../services/projects/project.type'
// Set the app element for accessibility
Modal.setAppElement('#root')

interface ProjectModelProps {
  isOpen: boolean
  onClose: () => void
}

// Custom styles for the modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: Colors.darkGreen,
    border: 'none',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    width: '24rem',
    maxWidth: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 50
  }
}

const statusOptions = [
  { value: ProjectStatus.PLANING, label: 'Planing' },
  { value: ProjectStatus.DEVELOPMENT, label: 'Development' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.MAINTENANCE, label: 'Maintenance' },
  { value: ProjectStatus.HOLDING, label: 'Holding' },
  { value: ProjectStatus.FINISHED, label: 'Finished' }
]

export const ProjectModel = ({ isOpen, onClose }: ProjectModelProps): JSX.Element => {
  const [projectName, setProjectName] = useState('')
  const [memberCount, setMemberCount] = useState(0)
  const [color, setColor] = useState('#000000')
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.PLANING)
  const [, setSelectedImage] = useState<File | null>(null) // Keep setter for use in handlers
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { mutateAsync, isPending } = useCreateProject()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Use FileReader to create a data URL (compliant with CSP)
      const reader = new FileReader()

      reader.onload = (event): void => {
        // Use the data URL for both checking dimensions and preview
        const img = new Image()

        img.onload = () => {
          // Check if image exceeds max dimensions
          if (img.width > 500 || img.height > 500) {
            // alert('Image dimensions must be 500x500 pixels or smaller')
            return
          }
          console.log(event.target?.result)
          // If image is within size limits, proceed
          setSelectedImage(file)
          setImagePreview(event.target?.result as string) // Use the data URL for preview
        }

        // Set the data URL as the image source
        img.src = event.target?.result as string
      }

      // Read the file as a data URL
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      // Create project data object
      const projectData: ProjectCreate = {
        name: projectName,
        image_id: null, // Will be updated with actual image ID after upload
        status: status as ProjectStatus,
        color: color, // Include the selected color
        member_count: memberCount // Include the member count
      }

      console.log('Submitting project data:', projectData)

      // Submit the project
      await mutateAsync(projectData)

      // Reset form and close modal
      setProjectName('')
      setMemberCount(0)
      setColor('#000000')
      setSelectedImage(null)
      setImagePreview(null)
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  // Reset form when modal is closed
  const handleAfterClose = (): void => {
    setProjectName('')
    setMemberCount(1)
    setSelectedImage(null)
    setImagePreview(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Create New Project"
      onAfterClose={handleAfterClose}
      closeTimeoutMS={300}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={true}
    >
      <div className="relative" style={{ fontFamily: 'Exo, sans-serif' }}>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-400 hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} color={Colors.light} />
        </button>

        <p
          className="text-xl font-bold"
          style={{ fontFamily: 'Skyer', color: Colors.primary, paddingInline: 5, marginBottom: 10 }}
        >
          Create New Project
        </p>

        <form onSubmit={handleSubmit}>
          {/* Project Image */}
          <div style={{ marginBottom: 10 }}>
            <div
              className="border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer"
              style={{ padding: 10, borderRadius: 5, border: '1px solid #cccccc88' }}
              onClick={() => document.getElementById('project-image')?.click()}
            >
              {imagePreview ? (
                <div className="relative w-full h-40">
                  <img
                    src={imagePreview}
                    alt="Project preview"
                    className="w-full h-full object-cover rounded-md"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={(e): void => {
                      e.stopPropagation()
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                  >
                    <X size={16} color="white" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload size={40} className="text-gray-400 " style={{ marginBottom: 5 }} />
                  <p className="text-sm text-gray-400">Click to upload project image</p>
                </div>
              )}
              <input
                type="file"
                id="project-image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Project Name */}
          <div style={{ marginBottom: 10, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-300"
              style={{ marginBottom: 5 }}
            >
              Project Name
            </label>
            <input
              type="text"
              id="project-name"
              value={projectName}
              onChange={(e): void => setProjectName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
              required
            />
          </div>

          {/* Number of Members */}
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="member-count"
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ marginBottom: 5 }}
            >
              Number of Members
            </label>
            <input
              type="number"
              id="member-count"
              value={memberCount}
              onChange={(e): void => setMemberCount(parseInt(e.target.value))}
              min="1"
              className="w-full  bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5, paddingInline: 5, paddingBlock: 10 }}
              required
            />
          </div>
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <label
              htmlFor="member-count"
              className="block text-sm font-medium text-gray-300 mb-2"
              style={{ marginBottom: 5 }}
            >
              Status
            </label>
            <select
              value={status}
              onChange={(e): void => setStatus(e.target.value as ProjectStatus)}
              style={{ borderRadius: 5, paddingInline: 5, paddingBlock: 10, color: Colors.light }}
              className="w-full   bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ color: Colors.light, backgroundColor: Colors.darkGreen }}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 20, borderBottom: '1px solid #cccccc88' }}>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e): void => setColor(e.target.value)}
              className="w-full  bg-gray-700 border border-gray-600 cursor-pointer rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ color: Colors.light, borderRadius: 5 }}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50"
            style={{
              borderRadius: 5,
              backgroundColor: Colors.primary,
              color: Colors.light,
              padding: 10
            }}
            disabled={isPending || !projectName.trim()}
          >
            {isPending ? <PulseLoader color={Colors.light} size={10} /> : 'Create Project'}
          </button>
        </form>
      </div>
    </Modal>
  )
}

import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { JSX, useState } from 'react'
import { Project, ProjectStatus } from '../../services/projects/project.type'
import { formatDate } from 'date-fns'
import { getImageUrl } from '@renderer/utils'
import { Trash2 } from 'lucide-react'
import { useDeleteProject } from '../../services/projects/project.service'
import { ProjectDeleteConfirmModal } from './ProjectDeleteConfirmModel'

type ProjectListItemProps = {
  project: Project
  click: () => void
  onDoubleClick: (project: Project) => void
}

export const ProjectListItem = ({
  project,
  click,
  onDoubleClick
}: ProjectListItemProps): JSX.Element => {
  const { selectedProjectId } = useFullScreenState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { mutateAsync: deleteProject, isPending } = useDeleteProject()

  const isActive = project.id === selectedProjectId

  const handleDeleteClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      await deleteProject(project.id!)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <>
      <div
        key={project.id}
        className="flex-shrink-0 w-72 rounded-lg shadow-sm overflow-hidden select-none"
        style={{
          border: isActive ? `2px solid ${Colors.primary}` : `2px solid ${Colors.muted}`,
          backgroundColor: Colors.mutedForeground
        }}
        onClick={click}
        onDoubleClick={() => onDoubleClick(project)}
      >
        <div className="" style={{ padding: 10 }}>
          <div className="flex flex-col items-start justify-between mb-2">
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-2 ">
                {project.isNew && (
                  <span
                    className="bg-green-500 text-white text-xs rounded mr-2"
                    style={{ padding: '2px 6px' }}
                  >
                    NEW
                  </span>
                )}
                <div
                  className="w-5 h-5 flex items-center justify-center rounded mr-2"
                  style={{ backgroundColor: project.color }}
                >
                  {project.image_id ? (
                    <img
                      src={getImageUrl(project.image.url)}
                      style={{ width: '100%', height: '100%' }}
                      className="object-contain rounded-sm"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18Z"
                        fill="white"
                      />
                    </svg>
                  )}
                </div>

                <p className="font-bold">{project.name}</p>
              </div>
              {isActive && (
                <button
                  className="p-1 rounded-full hover:bg-red-50 cursor-pointer"
                  onClick={handleDeleteClick}
                  disabled={isPending}
                >
                  <Trash2 size={20} color={Colors.accent2} />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                {project.status === ProjectStatus.DEVELOPMENT && (
                  <span
                    className="bg-blue-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    DEVELOPMENT
                  </span>
                )}
                {project.status === ProjectStatus.COMPLETED && (
                  <span
                    className="bg-green-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    COMPLETED
                  </span>
                )}
                {project.status === ProjectStatus.PLANING && (
                  <span
                    className="bg-yellow-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    PLANNING
                  </span>
                )}
                {project.status === ProjectStatus.HOLDING && (
                  <span
                    className="bg-gray-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    HOLDING
                  </span>
                )}
                {project.status === ProjectStatus.MAINTENANCE && (
                  <span
                    className="bg-purple-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    MAINTENANCE
                  </span>
                )}
                {project.status === ProjectStatus.FINISHED && (
                  <span
                    className="bg-green-500 text-white text-xs rounded"
                    style={{ padding: '2px 6px' }}
                  >
                    FINISHED
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 w-full">
              <div className="flex items-center justify-between">
                <p className="text-xs text-light">
                  {project.task_count} tasks / {project.member_count} members
                </p>
                <p className="text-xs text-light">
                  {formatDate(project.created_at || '', 'yyyy-MMM-dd')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectDeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        project={project}
        isLoading={isPending}
      />
    </>
  )
}

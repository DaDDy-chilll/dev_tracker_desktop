import { Colors } from '@renderer/constants/Colors'
import { JSX, useRef, useState, useEffect } from 'react'
import { DiamondPlus } from 'lucide-react'
import { ProjectModel } from './ProjectModel'
import { useGetProjects } from '../../services'
import { ProjectCardLoading } from './ProjectLoading'
import { Project } from '../../services/projects/project.type'
import { ProjectListItem } from './ProjectListItem'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
export const ProjectLists = (): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useGetProjects()
  const { setSelectedProjectId } = useFullScreenState()
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      setProjects(data.data)
      setSelectedProjectId(Number(data.data[0].id))
    }
  }, [data, setSelectedProjectId])

  const handleOpenModal = (): void => {
    setIsOpen(true)
  }

  const handleProjectSelect = (id: number): void => {
    setSelectedProjectId(id)
  }

  return (
    <>
      <div
        className="flex flex-row gap-3 items-center  w-full h-full "
        style={{ paddingInline: 5, paddingBlock: 5 }}
      >
        <div
          className="flex flex-row gap-3 overflow-x-auto w-full"
          style={{
            fontFamily: '"Exo", sans-serif',
            color: Colors.light,
            paddingBottom: 5
          }}
        >
          {isLoading ? (
            <ProjectCardLoading count={3} />
          ) : (
            projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                click={() => handleProjectSelect(Number(project.id))}
              />
            ))
          )}
        </div>
        <button
          className="w-20 h-full  flex items-center justify-center hover:bg-green-500"
          style={{ backgroundColor: Colors.primary, borderRadius: 5 }}
          onClick={handleOpenModal}
          ref={buttonRef}
        >
          <DiamondPlus
            size={34}
            className="text-white hover:text-green-900 cursor-pointer transition-colors duration-100"
          />
        </button>
      </div>

      <ProjectModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

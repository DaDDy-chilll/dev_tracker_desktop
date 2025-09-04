import { Colors } from '@renderer/constants/Colors'
import { useFullScreenState } from '@renderer/layouts/full-screen/useFullScreenState'
import { DiamondPlus } from 'lucide-react'
import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useGetProjects } from '../../../services'
import { Project } from '../../../services/projects/project.type'
import { ProjectListItem } from './ProjectListItem'
import { ProjectCardLoading } from './ProjectLoading'
import { ProjectModel } from './ProjectModel'

export const ProjectLists = (): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { data, isLoading } = useGetProjects()
  const { setSelectedProjectId } = useFullScreenState()

  console.log('data----', data)
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      setProjects(data.data)
      setSelectedProjectId({
        id: Number(data.data[0].id),
        projectDir: data.data[0].project_file_url || ''
      })
    }
  }, [data, setSelectedProjectId])

  const handleOpenModal = (): void => {
    setSelectedProject(null)
    setIsOpen(true)
  }

  const handleProjectSelect = (id: number, projectDir: string | undefined): void => {
    setSelectedProjectId({
      id,
      projectDir: projectDir || ''
    })
  }

  const handleProjectEdit = (project: Project): void => {
    setSelectedProject(project)
    setIsOpen(true)
  }

  const handleCloseModal = (): void => {
    setIsOpen(false)
    setSelectedProject(null)
  }

  const statusOrder: string[] = useMemo(
    () => ['development', 'maintenance', 'holding', 'complete', 'finished', 'planning'],
    []
  )

  const statusRank = (status?: string): number => {
    const key = (status || '').toLowerCase().trim()
    const idx = statusOrder.indexOf(key)
    return idx === -1 ? statusOrder.length : idx
  }

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => statusRank(a.status) - statusRank(b.status))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  console.log('project (sorted)', sortedProjects)

  return (
    <>
      <div className="flex flex-row gap-3 items-center w-full h-full">
        <div
          className="flex flex-row gap-3 overflow-x-auto w-full p-3"
          style={{
            fontFamily: '"Exo", sans-serif',
            color: Colors.light
          }}
        >
          {isLoading ? (
            <ProjectCardLoading count={3} />
          ) : (
            sortedProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                click={() => handleProjectSelect(Number(project.id), project.project_file_url)}
                onDoubleClick={() => handleProjectEdit(project)}
              />
            ))
          )}
        </div>
        <button
          className="w-20 h-full flex items-center justify-center hover:bg-green-500"
          style={{ backgroundColor: Colors.primary, borderRadius: 5 }}
          onClick={handleOpenModal}
          ref={buttonRef}
        >
          <DiamondPlus
            size={34}
            color={Colors.light}
            className="text-white hover:text-green-900 cursor-pointer transition-colors duration-100"
          />
        </button>
      </div>
      <ProjectModel isOpen={isOpen} onClose={handleCloseModal} data={selectedProject} />
    </>
  )
}

import { JSX } from 'react'
import Skeleton from 'react-loading-skeleton'

interface ProjectCardLoadingProps {
  count: number
  width?: number
  height?: number
}

export const ProjectCardLoading = ({
  count,
  width = 200,
  height = 100
}: ProjectCardLoadingProps): JSX.Element => {
  return (
    <div className="flex flex-row gap-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={index}
          height={height}
          width={width}
          baseColor="#8d8d8d71"
          highlightColor="#8d8d8d71"
        />
      ))}
    </div>
  )
}

export const ProjectTableLoading = ({ count }: ProjectCardLoadingProps): JSX.Element => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <tr key={index} style={{ marginBlock: 10 }}>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
          <td className="px-4 py-2">
            <Skeleton height={20} width={200} baseColor="#8d8d8d71" highlightColor="#8d8d8d71" />
          </td>
        </tr>
      ))}
    </>
  )
}

import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { Pause, Play, Star } from 'lucide-react'

type Task = {
  id: number
  title: string
  subtitle: string
  status: 'paused' | 'playing'
  starred: boolean
}

export const ToadyTasks = (): JSX.Element => {
  // Sample data - this would come from props or state in a real app
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Color Palette Selection',
      subtitle: 'Over9k: Gamers App',
      status: 'paused',
      starred: false
    },
    {
      id: 2,
      title: 'Creating Landing page for...',
      subtitle: 'Guitar Tuner',
      status: 'playing',
      starred: false
    },
    {
      id: 3,
      title: 'Competitive & functional a...',
      subtitle: 'Doctor+',
      status: 'playing',
      starred: false
    },
    {
      id: 4,
      title: 'Competitive & functional a...',
      subtitle: 'Doctor+',
      status: 'playing',
      starred: false
    }
  ]

  return (
    <div
      className={clsx('w-full h-fit', 'rounded-md')}
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 10,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center" style={{ marginBlock: 10 }}>
        <div className="flex items-center gap-2 text-2xl">
          <h1
            style={{
              color: Colors.primary,
              fontWeight: 600,
              fontFamily: 'Skyer'
            }}
          >
            Today&apos;s tasks
          </h1>
          <div
            className="rounded-md flex justify-center items-center"
            style={{
              backgroundColor: Colors.accentForeground,
              border: '1px solid #333',
              width: '28px',
              height: '28px',
              color: Colors.primary,
              fontSize: '0.9rem'
            }}
          >
            {tasks.length}
          </div>
        </div>

        <a
          href="#"
          style={{
            color: Colors.primary,
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Manage
          <span style={{ marginLeft: '4px' }}>&gt;</span>
        </a>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3  rounded-lg"
            style={{ backgroundColor: '#1e1e1e', paddingBlock: 5, paddingInline: 10 }}
          >
            {/* Play/Pause Button */}
            <div
              className="rounded-full flex justify-center items-center"
              style={{
                backgroundColor: task.id === 1 ? '#E74C3C' : Colors.primary,
                width: '35px',
                height: '35px',
                flexShrink: 0
              }}
            >
              {task.status === 'paused' ? (
                <Pause color="white" fill="white" style={{ marginRight: 2 }} />
              ) : (
                <Play size={18} color="white" fill="white" />
              )}
            </div>

            {/* Task Content */}
            <div className="flex-grow ">
              <div style={{ color: 'white', fontWeight: 500 }} className="text-lg">
                {task.title}
              </div>
              <div style={{ color: Colors.primary }} className="text-sm">
                {task.subtitle}
              </div>
            </div>

            {/* Star Button */}
            <div>
              <Star
                size={20}
                color="#888"
                fill={task.starred ? '#888' : 'none'}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { Plus, Video } from 'lucide-react'

type Meeting = {
  id: number
  time: string
  period: 'AM' | 'PM'
  title: string
  appIcon: JSX.Element
  color?: string
  active?: boolean
}

export const TodayMeeting = (): JSX.Element => {
  // Sample data - this would come from props or state in a real app
  const meetings: Meeting[] = [
    {
      id: 1,
      time: '10:00',
      period: 'AM',
      title: 'Present the project and gather feedback',
      appIcon: (
        <div className="rounded-full p-2" style={{ backgroundColor: '#093325' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 11.5C9 12.8807 7.88071 14 6.5 14C5.11929 14 4 12.8807 4 11.5C4 10.1193 5.11929 9 6.5 9C7.88071 9 9 10.1193 9 11.5Z"
              fill="#10B981"
            />
            <path
              d="M14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5Z"
              fill="#10B981"
            />
            <path
              d="M19 11.5C19 12.8807 17.8807 14 16.5 14C15.1193 14 14 12.8807 14 11.5C14 10.1193 15.1193 9 16.5 9C17.8807 9 19 10.1193 19 11.5Z"
              fill="#10B981"
            />
          </svg>
        </div>
      ),
      color: '#09583e',
      active: true
    },
    {
      id: 2,
      time: '01:00',
      period: 'PM',
      title: 'Meeting with UX team',
      appIcon: <Video size={20} color="#888" />
    },
    {
      id: 3,
      time: '03:00',
      period: 'PM',
      title: 'Onboarding of the project',
      appIcon: (
        <div className="rounded-full bg-gray-700 p-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 2V5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 2V5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 8H21" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z"
              stroke="#888"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      )
    },
    {
      id: 4,
      time: '',
      period: 'PM',
      title: 'Schedule meeting',
      appIcon: <Plus size={20} color="#888" />,
      color: '#3a3a3a'
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
      <div className="flex justify-between items-center text-2xl" style={{ marginBlock: 10 }}>
        <div className="flex items-center gap-2">
          <h1
            style={{
              color: Colors.primary,
              fontWeight: 600,
              fontFamily: 'Skyer'
            }}
          >
            Today&apos;s meetings
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
            {meetings.length}
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
          View all
          <span style={{ marginLeft: '4px' }}>&gt;</span>
        </a>
      </div>

      {/* Meeting Grid */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-lg  relative z-1"
            style={{
              padding: 10,
              backgroundColor: meeting.color || '#1e1e1e',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {meeting.active && (
              <div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                style={{ backgroundColor: '#10B981', border: '2px solid #272727' }}
              ></div>
            )}

            {meeting.id === 4 ? (
              // Schedule meeting button
              <div className="flex flex-col items-center justify-center h-full">
                <div
                  className="rounded-full border-2 border-blue-500 w-12 h-12 flex items-center justify-center mb-2"
                  style={{ borderColor: Colors.primary }}
                >
                  <Plus size={24} color={Colors.primary} />
                </div>
                <div style={{ color: Colors.primary, fontSize: '1.1rem' }}>Schedule meeting</div>
              </div>
            ) : (
              // Regular meeting
              <>
                <div className="flex justify-between">
                  <div>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>{meeting.period}</div>
                    <div
                      style={{
                        color: meeting.active ? '#10B981' : 'white',
                        fontSize: '1.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {meeting.time}
                    </div>
                  </div>
                  <div className="flex items-start">{meeting.appIcon}</div>
                </div>
                <div
                  className="text-sm"
                  style={{ color: meeting.active ? '#10B981' : Colors.muted, marginTop: 'auto' }}
                >
                  {meeting.title}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

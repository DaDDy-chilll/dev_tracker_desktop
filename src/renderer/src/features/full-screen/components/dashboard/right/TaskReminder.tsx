import { JSX } from 'react'
import { Colors } from '@renderer/constants/Colors'
import clsx from 'clsx'
import { ChevronRight, Plus } from 'lucide-react'
import AnimatedList from '@renderer/components/ui/AnimatedList'
type Reminder = {
  id: number
  time: string
  period: 'AM' | 'PM'
  description: string
  priority: 'Low' | 'High'
}

export const TaskReminder = (): JSX.Element => {
  // Sample data - this would come from props or state in a real app
  const reminders: Reminder[] = [
    {
      id: 1,
      time: '09:30',
      period: 'AM',
      description: 'Check test results',
      priority: 'Low'
    },
    {
      id: 2,
      time: '10:00',
      period: 'AM',
      description: 'Client Presentation',
      priority: 'High'
    },
    {
      id: 3,
      time: '04:15',
      period: 'PM',
      description: 'Add new subtask to Doctor+ analysis',
      priority: 'High'
    },
    {
      id: 4,
      time: '04:15',
      period: 'PM',
      description: 'Add new subtask to Doctor+ analysis',
      priority: 'High'
    },
    {
      id: 5,
      time: '04:15',
      period: 'PM',
      description: 'Add new subtask to Doctor+ analysis',
      priority: 'High'
    },
    {
      id: 5,
      time: '04:15',
      period: 'PM',
      description: 'Add new subtask to Doctor+ analysis',
      priority: 'High'
    }
  ]

  return (
    <div
      className={clsx('w-full h-fit', 'rounded-md')}
      style={{
        backgroundColor: Colors.darkGreen,
        padding: 16,
        fontFamily: '"Exo", sans-serif'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center text-2xl" style={{ marginBottom: 16 }}>
        <h1
          style={{
            color: Colors.primary,
            fontWeight: 600,
            fontFamily: 'Skyer'
          }}
        >
          Reminders
        </h1>

        <a
          href="#"
          style={{
            color: '#3B82F6',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Manage
          <ChevronRight size={16} />
        </a>
      </div>

      {/* Reminder Cards with AnimatedList */}
      <div className="h-[38vh]">
        <AnimatedList
          className="w-full"
          items={reminders.map((reminder) => reminder.id.toString())}
          displayScrollbar={false}
          showGradients={false}
          itemClassName="p-0"
          onItemSelect={(_, index) => console.log(`Selected reminder ${index}`)}
          initialSelectedIndex={-1}
          renderItem={(_, index) => {
            const reminder = reminders[index]
            return (
              <div
                className="rounded-lg"
                style={{
                  backgroundColor: '#1e1e1e',
                  paddingBlock: 10,
                  paddingInline: 20,
                  marginBlock: 5
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold" style={{ color: Colors.primary }}>
                      {reminder.time}
                    </span>
                    <span className="text-gray-400 ml-1">{reminder.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        color: reminder.priority === 'High' ? '#E74C3C' : '#10B981',
                        fontSize: '0.9rem'
                      }}
                    >
                      {reminder.priority}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: reminder.priority === 'High' ? '#E74C3C' : '#10B981'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-white text-lg">{reminder.description}</div>
              </div>
            )
          }}
        />
      </div>

      {/* Add Reminder Button */}
      <button
        className="p-4 w-full text-center flex gap-3 justify-center items-center"
        style={{ backgroundColor: '#1e3b32', color: '#10B981', paddingBlock: 10, borderRadius: 8 }}
      >
        <Plus />
        Add reminder
      </button>
    </div>
  )
}

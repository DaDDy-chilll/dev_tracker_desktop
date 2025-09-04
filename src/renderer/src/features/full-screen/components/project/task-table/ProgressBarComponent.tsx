import { JSX, useState, useEffect } from 'react'
import { useUpdateTask } from '@renderer/features/full-screen/services'
import { Button, Modal, Slider, Progress } from 'antd'
import { Colors } from '@renderer/constants/Colors'

export const ProgressBarComponent = ({
  progress: initialProgress,
  id,
  projectId
}: {
  progress: number
  id: number
  projectId: number
}): JSX.Element => {
  const [progress, setProgress] = useState(initialProgress)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempProgress, setTempProgress] = useState(initialProgress)
  const { mutateAsync: updateTask, isPending } = useUpdateTask()

  // Update local progress when the prop changes
  useEffect(() => {
    setProgress(initialProgress)
    setTempProgress(initialProgress)
  }, [initialProgress])

  const showModal = (): void => {
    setTempProgress(progress)
    setIsModalOpen(true)
  }

  const handleOk = async (): Promise<void> => {
    try {
      await updateTask({
        id,
        progress: tempProgress,
        project_id: projectId,
        isUpdateStatus: false
      })
      setProgress(tempProgress)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleCancel = (): void => {
    setTempProgress(progress) // Reset to original progress
    setIsModalOpen(false)
  }

  const getProgressColor = (percent: number): string => {
    if (percent < 25) return '#ff4d4f' // Red for 0-24%
    if (percent < 50) return '#faad14' // Orange for 25-49%
    if (percent < 75) return '#1890ff' // Blue for 50-74%
    return Colors.primary // Green for 75-100%
  }

  return (
    <div>
      <div className="flex cursor-pointer w-full items-center gap-2 " onClick={showModal}>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={getProgressColor(progress)}
          trailColor={Colors.muted}
          strokeWidth={8}
        />
        <div
          style={{
            fontSize: '16px',
            color: getProgressColor(progress)
          }}
          onClick={showModal}
        >
          {progress}%
        </div>
      </div>

      <Modal
        styles={{
          content: { backgroundColor: Colors.darkGreen, color: Colors.light },
          header: { backgroundColor: Colors.darkGreen, color: Colors.light }
        }}
        title={
          <p
            className="text-xl"
            style={{ fontFamily: 'Skyer', fontWeight: 'bold', color: Colors.primary }}
          >
            Update Progress
          </p>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            style={{ backgroundColor: Colors.primary }}
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={isPending}
          >
            Update Progress
          </Button>
        ]}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{tempProgress}%</span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={tempProgress}
            onChange={setTempProgress}
            tooltip={{ formatter: (value) => `${value}%` }}
            trackStyle={{ backgroundColor: Colors.primary }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

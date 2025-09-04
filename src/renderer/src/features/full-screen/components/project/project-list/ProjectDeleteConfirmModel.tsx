import { Button, Modal } from 'antd'
import { JSX } from 'react'
import { Project } from '../../services/projects/project.type'
import { Colors } from '@renderer/constants/Colors'

interface ProjectDeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  project: Project
  isLoading?: boolean
}

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
  },
  header: {
    backgroundColor: Colors.darkGreen,
    borderBottom: `1px solid ${Colors.muted}`,
    paddingBottom: '16px',
    marginBottom: '16px'
  }
}

export const ProjectDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  project,
  isLoading = false
}: ProjectDeleteConfirmModalProps): JSX.Element => {
  return (
    <Modal
      title={
        <span
          style={{
            fontFamily: 'Skyer',
            color: Colors.primary,
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}
        >
          Delete Project
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      centered
      width={425}
      styles={customStyles}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>,
        <Button key="delete" type="primary" danger onClick={onConfirm} loading={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete Project'}
        </Button>
      ]}
    >
      <p style={{ color: Colors.light, fontSize: '1rem', marginBottom: '0.5rem' }}>
        Are you sure you want to delete the project{' '}
        <span style={{ color: Colors.primary }}>{project.name}</span> ?
      </p>
      <p style={{ color: Colors.muted, fontSize: '0.9rem' }}>
        This will also permanently delete all tasks associated with this project. This action cannot
        be undone.
      </p>
    </Modal>
  )
}

export default ProjectDeleteConfirmModal

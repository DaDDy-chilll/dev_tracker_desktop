import { ipcMain } from 'electron'
import { promisify } from 'util'
import { execFile } from 'child_process'
const execAsync = promisify(execFile)

// Map task statuses to git branches
const statusToBranchMap: Record<string, string> = {
  NOT_STARTED: 'main',
  IN_PROGRESS: 'main',
  IN_REVIEW: 'testing',
  IN_TEST: 'production',
  DONE: 'main'
}

ipcMain.on(
  'task-change-status',
  async (event, status: string, projectDir: string, category: string, branchName: string) => {
    console.log('Task status changed to:', status)
    console.log('targetBranch@@@@@', statusToBranchMap[status] || 'main')
    console.log('projectDir@@@@@', projectDir)
    console.log('category@@@@@', category)

    try {
      const targetBranch = `${category}/${branchName}`
      const commands: string[] = []

      // Build commands based on status
      switch (status) {
        case 'NOT_STARTED':
        case 'IN_PROGRESS':
          commands.push(
            `cd ${projectDir} && git checkout -b ${targetBranch} 2>/dev/null || git checkout ${targetBranch}`
          )
          break

        case 'IN_REVIEW':
          commands.push(
            `cd ${projectDir} && git checkout -b ${targetBranch} 2>/dev/null || git checkout ${targetBranch} && git stash ${targetBranch}`
          )
          break

        case 'IN_TEST':
          commands.push(
            `cd ${projectDir} && git checkout -b ${targetBranch} 2>/dev/null || git checkout ${targetBranch} && git add .`
          )
          break

        case 'DONE':
          commands.push(
            `cd ${projectDir} && git push 2>/dev/null || git push --set-upstream origin ${targetBranch}`
          )
          break

        default:
          commands.push(`cd ${projectDir} && git checkout ${targetBranch}`)
      }

      // Execute commands one by one
      for (const cmd of commands) {
        console.log('Executing command:', cmd)
        const { stdout, stderr } = await execAsync(cmd, { shell: '/bin/bash' })

        if (stderr && (stderr.includes('error') || stderr.includes('fatal'))) {
          throw new Error(stderr)
        }

        if (stdout) console.log('Command output:', stdout)
        if (stderr) console.log('Command stderr:', stderr)
      }

      // Send success response
      event.reply('task-status-success', {
        status,
        branch: `${category}/${branchName}`,
        output: 'Successfully executed git commands'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Git operation failed:', errorMessage)
      event.reply('task-status-error', errorMessage)
    }
  }
)

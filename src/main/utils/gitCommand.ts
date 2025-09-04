export const generateCommandForStatus = (
  projectDir: string,
  status: string,
  category: string,
  branchName: string
): string => {
  const targetBranch = `${category}/${branchName}`
  const commands = [`cd ${projectDir}`]

  // Function to get current branch and handle branch switching
  const getBranchSwitchCommand = (createNew: boolean = false): string => {
    const newBranchFlag = createNew ? '-b ' : ''
    return `
      current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "") &&
      if [ -z "$current_branch" ]; then
        # Initialize repo if not already a git repo
        git init && git add . && git commit -m "Initial commit" || true &&
        git checkout ${newBranchFlag}${targetBranch} 2>/dev/null || true
      elif [ "$current_branch" != "${targetBranch}" ]; then
        # Try to checkout existing branch, create new if it doesn't exist and createNew is true
        if [ "${createNew}" = true ]; then
          git checkout -b ${targetBranch} 2>/dev/null || 
          (git fetch origin ${targetBranch} 2>/dev/null && 
           git checkout ${targetBranch} 2>/dev/null) || 
          git checkout -b ${targetBranch}
        else
          git checkout ${targetBranch} 2>/dev/null || 
          (git fetch origin ${targetBranch} 2>/dev/null && 
           git checkout ${targetBranch} 2>/dev/null) || 
          { echo "Branch ${targetBranch} not found"; exit 1; }
        fi
      fi
    `
      .replace(/\s+/g, ' ')
      .trim()
  }

  switch (status) {
    case 'IN_TEST':
      // Just stage changes for IN_TEST
      commands.push(getBranchSwitchCommand())
      commands.push('git add .')
      break

    case 'DONE':
      // For DONE, ensure we're on the right branch and push
      commands.push(getBranchSwitchCommand())
      commands.push(`git push --set-upstream origin ${targetBranch}`)
      break

    case 'NOT_STARTED':
      // For NOT_STARTED, create and switch to new branch
      commands.push(getBranchSwitchCommand(true))
      break

    case 'IN_PROGRESS':
    case 'IN_REVIEW':
    default:
      // For other statuses, ensure we're on the right branch
      commands.push(getBranchSwitchCommand())
  }

  return commands.join(' && ')
}

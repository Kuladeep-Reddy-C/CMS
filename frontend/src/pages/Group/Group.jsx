import React from 'react'
import CreateGroupCard from './CreateGroupCard'
import RenderAllGroups from './RenderAllGroups'
import { useUser } from '@clerk/clerk-react'

const Group = () => {
  const { user } = useUser();
  console.log(user.id);
  return (
    <div>
      <CreateGroupCard />
      <RenderAllGroups />
    </div>
  )
}

export default Group

import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/utils'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import React from 'react'
import { toast } from 'sonner'

function DcoumentHeader({params}) {

  const shareDocument = (event) => {
    event.stopPropagation()
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/${params.workspaceid}/${params.documentid}`;
    copyToClipboard(link);
    toast('copied to clipboard!');
  }
  return (
    <div className='flex justify-between items-center p-3 px-7 shadow-md'>
        <div></div>
        <OrganizationSwitcher/>
        <div className='flex gap-2'>
            <Button onClick={shareDocument} >Share</Button>
            <UserButton/>
        </div>
    </div>
  )
}

export default DcoumentHeader
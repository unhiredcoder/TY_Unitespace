import { Link2Icon, MoreVertical, PenBox, Trash2 } from 'lucide-react'
import { copyToClipboard } from '../../../../lib/utils.js'; // Utility function to copy text to clipboard
import React from 'react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function DocumentOptions({ doc, deleteDocument }) {

  const shareDocument = (event) => {
    event.stopPropagation()
    // event.preventDefault(); // Prevent default behavior of the button
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/workspace/${doc.workspaceId}/${doc.id}`;
    copyToClipboard(link);
    toast('copied to clipboard!');
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
        <MoreVertical className='p-1 rounded-lg hover:bg-gray-300' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex gap-2">
            <Link2Icon className='h-4 w-4' /> <button  onClick={(event)=>shareDocument(event)}>Share Link</button> </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2">
            <PenBox className='h-4 w-4' />Rename</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteDocument(doc?.id)}
            className="flex gap-2 text-red-500">
            <Trash2 className='h-4 w-4' />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}

export default DocumentOptions
// "use client"

// import CoverPicker from '@/app/_components/CoverPicker'
// import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
// import { db } from '@/config/firebaseConfig';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';

// import { SmilePlus } from 'lucide-react';
// import Image from 'next/image'
// import React, { useEffect, useState } from 'react'
// import { toast } from 'sonner';

// function DocumentInfo({params}) {
//     const [coverImage,setCoverImage]=useState('/cover.png');
//     const [emoji,setEmoji]=useState();
//     const [documentInfo,setDocumentInfo]=useState();
//     useEffect(()=>{
//         params&&GetDocumentInfo();
//     },[params])

//     /**
//      * Used to get document info
//      */
//     const GetDocumentInfo=async()=>{
//         const docRef=doc(db,'workspaceDocuments',params?.documentid);
//         const docSnap=await getDoc(docRef);

//         if(docSnap.exists())
//         {
//             console.log(docSnap.data())
//             setDocumentInfo(docSnap.data())
//             setEmoji(docSnap.data()?.emoji);
//             docSnap.data()?.coverImage&&setCoverImage(docSnap.data()?.coverImage)
//         }
//     }
    
//     const updateDocumentInfo=async(key,value)=>{
//         const docRef=doc(db,'workspaceDocuments',params?.documentid);
//         await updateDoc(docRef,{
//             [key]:value
//         })
//         toast('Document Updated!')
//     }


//   return (
//     <div>
//         {/* Cover  */}
//         <CoverPicker setNewCover={(cover)=>{
//             setCoverImage(cover);
//             updateDocumentInfo('coverImage',cover)
//             }}>
//         <div className='relative group cursor-pointer'>
//                     <h2 className='hidden absolute p-4 w-full h-full
//                     items-center group-hover:flex
//                     justify-center  '>Change Cover</h2>
//                     <div className='group-hover:opacity-40'>
//                         <Image src={coverImage} width={400} height={400}
//                         className='w-full h-[200px] object-cover '
//                         />
//                     </div>
//                 </div>
//         </CoverPicker>
//         {/* Emoji Picker  */}
//         <div className='absolute ml-10 px-20 mt-[-40px] cursor-pointer'>
//             <EmojiPickerComponent 
//             setEmojiIcon={(emoji)=>{
//                 setEmoji(emoji);
//                 updateDocumentInfo('emoji',emoji)
//                 }}>
//             <div className='bg-[#ffffffb0] p-4 rounded-md'>
//                 {emoji?<span className='text-5xl'>{emoji}</span>: <SmilePlus className='h-10 w-10 text-gray-500'/>}
//             </div>
//             </EmojiPickerComponent>
//         </div>
//         {/* File Name  */}
//         <div className='mt-10 px-20 ml-10 p-10'>
//             <input type="text" 
//             placeholder='Untitled Document'
//             defaultValue={documentInfo?.documentName}
//             className='font-bold text-4xl outline-none'
//             onBlur={(event)=>updateDocumentInfo('documentName',event.target.value)}
//             />
//         </div>
//     </div>
//   )
// }

// export default DocumentInfo





"use client";

import CoverPicker from '@/app/_components/CoverPicker';
import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
import { db } from '@/config/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { SmilePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

function DocumentInfo({ params }) {
  const [coverImage, setCoverImage] = useState('/cover.png');
  const [emoji, setEmoji] = useState('');
  const [documentName, setDocumentName] = useState('');

  useEffect(() => {
    if (params?.documentid) {
      const docRef = doc(db, 'workspaceDocuments', params.documentid);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDocumentName(data.documentName || '');
          setEmoji(data.emoji || '');
          setCoverImage(data.coverImage || '/cover.png');
        }
      });

      return () => unsubscribe();
    }
  }, [params?.documentid]);

  const updateDocumentInfo = async (key, value) => {
    const docRef = doc(db, 'workspaceDocuments', params?.documentid);
    await updateDoc(docRef, { [key]: value });
    toast('Document Updated!');
  };

  return (
    <div>
      {/* Cover Picker */}
      <CoverPicker
        setNewCover={(cover) => {
          setCoverImage(cover);
          updateDocumentInfo('coverImage', cover);
        }}
      >
        <div className='relative group cursor-pointer'>
          <h2 className='hidden absolute p-4 w-full h-full items-center group-hover:flex justify-center'>
            Change Cover
          </h2>
          <div className='group-hover:opacity-40'>
            <Image
              src={coverImage}
              width={400}
              height={400}
              className='w-full h-[200px] object-cover'
            />
          </div>
        </div>
      </CoverPicker>

      {/* Emoji Picker */}
      <div className='absolute ml-10 px-20 mt-[-40px] cursor-pointer'>
        <EmojiPickerComponent
          setEmojiIcon={(selectedEmoji) => {
            setEmoji(selectedEmoji);
            updateDocumentInfo('emoji', selectedEmoji);
          }}
        >
          <div className='bg-[#ffffffb0] p-4 rounded-md'>
            {emoji ? (
              <span className='text-5xl'>{emoji}</span>
            ) : (
              <SmilePlus className='h-10 w-10 text-gray-500' />
            )}
          </div>
        </EmojiPickerComponent>
      </div>

      {/* Document Name */}
      <div className='mt-10 px-20 ml-10 p-10'>
        <input
          type='text'
          placeholder='Untitled Document'
          value={documentName}
          className='font-bold text-4xl outline-none w-full'
          onChange={(event) => setDocumentName(event.target.value)}
          onBlur={() => updateDocumentInfo('documentName', documentName)}
        />
      </div>
    </div>
  );
}

export default DocumentInfo;

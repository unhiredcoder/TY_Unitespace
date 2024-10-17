import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist'
import Embed from '@editorjs/embed';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code';
import { TextVariantTune } from '@editorjs/text-variant-tune';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import Paragraph from '@editorjs/paragraph';
import GenerateAITemplate from './GenerateAITemplate';


function RichDocumentEditor({ params }) {

  const ref = useRef();
  let editor;
  const { user } = useUser();
  const [documentOutput, setDocumentOutput] = useState([]);
  // const [isFetched,setIsFetched]=useState(false);
  let isFetched=false
  useEffect(() => {
    user && InitEditor();
  }, [user])

  /**
   * Used to save Document
   */
  const SaveDocument = () => {
    console.log("UPDATE")
    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);
     
      await updateDoc(docRef, {
        output: JSON.stringify(outputData),
        editedBy: user?.primaryEmailAddress?.emailAddress
      })
    })
  }

  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(doc(db, 'documentOutput', params?.documentid),
      (doc) => {
        if (doc.data()?.editedBy != user?.primaryEmailAddress?.emailAddress||isFetched==false)
          doc.data().editedBy&&editor?.render(JSON.parse(doc.data()?.output)); 
        isFetched=true  
      })
  }

  const InitEditor = () => {
    if (!editor?.current) {
      editor = new EditorJS({
        onChange: (api, event) => {
           SaveDocument()
          //ref.current.save().then(async (outputData) => {console.log(outputData)})
        },
        onReady:()=>{
          GetDocumentOutput()
        },
        /**
         * Id of Element that should contain Editor instance
         */
        holder: 'editorjs',
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph:Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            }
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered'
            },
          },
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P'
          },
          //   textVariant: TextVariantTune
        },
      });
      ref.current = editor;
    }
  }
  return (
    <div className=' '>
      <div id='editorjs' className='w-[70%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        <GenerateAITemplate setGenerateAIOutput={(output)=>editor?.render(output)} />
      </div>
    </div>
  )
}

export default RichDocumentEditor

// import React, { useEffect, useRef, useState } from 'react';
// import EditorJS from '@editorjs/editorjs';
// import Header from '@editorjs/header';
// import Delimiter from '@editorjs/delimiter';
// import Alert from 'editorjs-alert';
// import List from "@editorjs/list";
// import Checklist from '@editorjs/checklist';
// import SimpleImage from 'simple-image-editorjs';
// import Table from '@editorjs/table';
// import CodeTool from '@editorjs/code';
// import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
// import { db } from '@/config/firebaseConfig';
// import { useUser } from '@clerk/nextjs';
// import Paragraph from '@editorjs/paragraph';
// import GenerateAITemplate from './GenerateAITemplate';
// import CoverPicker from '@/app/_components/CoverPicker';
// import EmojiPickerComponent from '@/app/_components/EmojiPickerComponent';
// import Image from 'next/image';
// import { SmilePlus } from 'lucide-react';

// function RichDocumentEditor({ params }) {
//   const ref = useRef(null); // Reference for the editor instance
//   const { user } = useUser();
//   const [documentTitle, setDocumentTitle] = useState('');
//   const [coverImage, setCoverImage] = useState('/cover.png');
//   const [emoji, setEmoji] = useState('');

//   useEffect(() => {
//     if (user && params?.documentid) {
//       InitEditor();
//     }
//   }, [user, params?.documentid]);

//   useEffect(() => {
//     if (params?.documentid) {
//       const docRef = doc(db, 'workspaceDocuments', params.documentid);
//       const unsubscribe = onSnapshot(docRef, async (doc) => {
//         const data = doc.data();
//         if (data) {
//           setDocumentTitle(data.documentName || '');
//           setCoverImage(data.coverImage || '/cover.png');
//           setEmoji(data.emoji || '');
//           if (ref.current) {
//             try {
//               const outputData = JSON.parse(data.output || '[]');
//               await ref.current.render(outputData);
//             } catch (error) {
//               console.error('Error parsing output data:', error);
//             }
//           }
//         }
//       });
//       return () => unsubscribe();
//     }
//   }, [params?.documentid]);

//   const SaveDocument = async () => {
//     if (!ref.current) return;
//     const outputData = await ref.current.save();
//     const docRef = doc(db, 'documentOutput', params?.documentid);
//     await updateDoc(docRef, {
//       output: JSON.stringify(outputData),
//       editedBy: user?.primaryEmailAddress?.emailAddress
//     });
//   };

//   const InitEditor = () => {
//     if (!ref.current) {
//       ref.current = new EditorJS({
//         onChange: async () => {
//           await SaveDocument();
//         },
//         holder: 'editorjs',
//         tools: {
//           header: Header,
//           delimiter: Delimiter,
//           paragraph: Paragraph,
//           alert: {
//             class: Alert,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+A',
//             config: {
//               alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
//               defaultType: 'primary',
//               messagePlaceholder: 'Enter something',
//             }
//           },
//           table: Table,
//           list: {
//             class: List,
//             inlineToolbar: true,
//             shortcut: 'CMD+SHIFT+L',
//             config: {
//               defaultStyle: 'unordered'
//             },
//           },
//           checklist: {
//             class: Checklist,
//             shortcut: 'CMD+SHIFT+C',
//             inlineToolbar: true,
//           },
//           image: SimpleImage,
//           code: {
//             class: CodeTool,
//             shortcut: 'CMD+SHIFT+P'
//           },
//         },
//       });
//     }
//   };

//   const handleTitleChange = async (event) => {
//     const newTitle = event.target.value;
//     setDocumentTitle(newTitle);

//     // Update the document title in Firestore
//     const docRef = doc(db, 'workspaceDocuments', params?.documentid);
//     await updateDoc(docRef, {
//       documentName: newTitle
//     });
//   };

//   const updateDocumentInfo = async (key, value) => {
//     const docRef = doc(db, 'workspaceDocuments', params?.documentid);
//     await updateDoc(docRef, {
//       [key]: value
//     });
//   };

//   return (
//     <div>
//       {/* Cover Picker */}
//       <CoverPicker setNewCover={(cover) => {
//         setCoverImage(cover);
//         updateDocumentInfo('coverImage', cover);
//       }}>
//         <div className='relative group cursor-pointer'>
//           <h2 className='hidden absolute p-4 w-full h-full items-center group-hover:flex justify-center'>Change Cover</h2>
//           <div className='group-hover:opacity-40'>
//             <Image src={coverImage} width={400} height={400} className='w-full h-[200px] object-cover' />
//           </div>
//         </div>
//       </CoverPicker>

//       {/* Emoji Picker */}
//       <div className='absolute ml-10 px-20 mt-[-40px] cursor-pointer'>
//         <EmojiPickerComponent setEmojiIcon={(selectedEmoji) => {
//           setEmoji(selectedEmoji);
//           updateDocumentInfo('emoji', selectedEmoji);
//         }}>
//           <div className='bg-[#ffffffb0] p-4 rounded-md'>
//             {emoji ? <span className='text-5xl'>{emoji}</span> : <SmilePlus className='h-10 w-10 text-gray-500' />}
//           </div>
//         </EmojiPickerComponent>
//       </div>

//       {/* Document Title Input */}
//       <input
//         type="text"
//         value={documentTitle}
//         onChange={handleTitleChange}
//         placeholder='Untitled Document'
//         className='font-bold text-4xl outline-none w-full'
//       />

//       {/* EditorJS */}
//       <div id='editorjs' className='w-full'></div>

//       <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
//         <GenerateAITemplate setGenerateAIOutput={(output) => ref.current?.render(output)} />
//       </div>
//     </div>
//   );
// }

// export default RichDocumentEditor;

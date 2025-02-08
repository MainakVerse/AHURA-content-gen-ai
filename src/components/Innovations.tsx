'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
 
} from '@/components/ui/dialog';

import {
    ImageGen,
    VoiceGen,
    BotGen,
    PdfGen,
    ResumeGen,
    RecipeGen
    
  } from "@/assets";

  type BoxItem = {
    id: number;
    image: any;
    title: string;
   
  };

const images = [
    ImageGen,
    VoiceGen,
    BotGen,
    PdfGen,
    ResumeGen,
    RecipeGen
  ];
  

const Innovations: React.FC = () => {
  const [selectedBox, setSelectedBox] = useState<BoxItem | null>(null);

  const boxes: BoxItem[] = [
    { 
      id: 1, 
      image: images[0], 
      title: "Image Generator", 
      
    },
    { 
      id: 2, 
      image: images[1], 
      title: "Voice Generator", 
      
    },
    { 
      id: 3, 
      image: images[2], 
      title: "Bot Generator", 
     
    },
    { 
      id: 4, 
      image: images[3], 
      title: "PDF Generator", 
    
    },
    { 
      id: 5, 
      image: images[4], 
      title: "Resume Generator", 
      
    },
    { 
      id: 6, 
      image: images[5], 
      title: "Code Generator", 
      
    }
  ];

  return (
    <>
    <div className="text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <h2 className='text-4xl'>Coming Soon!</h2>
    </div>
    <div className="p-4 sm:p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {boxes.map((box) => (
          <motion.div 
            key={box.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedBox(box)}
            className="bg-white text-black shadow-md rounded-lg overflow-hidden cursor-pointer  flex items-center justify-center"
          >
            <div className="aspect-w-16 aspect-h-9 flex items-center justify-center">
              <Image 
                src={box.image} 
                alt={box.title}
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-base sm:text-lg font-semibold">{box.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedBox && (
        <Dialog open={!!selectedBox} onOpenChange={() => setSelectedBox(null)}>
          <DialogContent className="text-black w-[95%] h-[50%] max-w-[425px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ 
                rotateX: 10, 
                rotateY: -10, 
                scale: 1.02 
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="bg-white rounded-xl shadow-2xl p-4 sm:p-6"
            >
              {/*<DialogHeader>
                <DialogTitle>{selectedBox.title}</DialogTitle>
              </DialogHeader>*/}
              
              <div className="aspect-w-16 aspect-h-9 mt-4">
                <Image 
                  src={selectedBox.image} 
                  alt={selectedBox.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              
              
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </>
  );
};

export default Innovations;
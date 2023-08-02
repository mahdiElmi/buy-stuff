"use client";
// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton, UploadDropzone } from "@uploadthing/react";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { ProductData } from "@/app/products/add/page";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function ImageUpload({
  setProductData,
  imgUrls,
}: {
  setProductData: Dispatch<SetStateAction<ProductData>>;
  imgUrls: string[];
}) {
  function deletePhoto(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    imgUrl: string,
  ) {
    console.log("deleted: ", imgUrl.split("/f/")[1]);
  }
  // const [imageUrls, setImageUrls] = useState<string[]>([]);
  return (
    <main className="flex flex-col justify-center gap-5">
      <div className="rounded-lg bg-zinc-200 px-2 pb-2 dark:bg-zinc-900">
        {/* <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            setProductData((oldProductData) => ({
              ...oldProductData,
              imgUrls: [...oldProductData.imgUrls, res![0].fileUrl],
            }));
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        /> */}
        <UploadDropzone<OurFileRouter>
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            setProductData((oldProductData) => ({
              ...oldProductData,
              imgUrls: [...oldProductData.imgUrls, res![0].fileUrl],
            }));
            alert("Upload Completed");
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
      <div className="flex gap-1">
        {imgUrls.map((imgUrl) => (
          <div className="bg-zinc-500/50drop-shadow-md group relative aspect-square rounded-sm">
            <button
              className="invisible absolute right-1 top-1 z-10 h-7 w-7 rounded-md bg-zinc-950/50 p-1 text-white drop-shadow-lg group-hover:visible"
              title="delete photo"
              onClick={(e) => {
                deletePhoto(e, imgUrl);
              }}
            >
              <TrashIcon className="" />
            </button>
            <Image
              width={125}
              height={125}
              className="aspect-square rounded-lg object-cover drop-shadow-2xl"
              src={imgUrl}
              alt="product Image"
            />
          </div>
        ))}
      </div>
    </main>
  );
}

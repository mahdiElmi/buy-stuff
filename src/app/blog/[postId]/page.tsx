import DateToggle from "@/app/product/[productId]/DateToggle";
import posts from "@/postsData";
import { faker } from "@faker-js/faker";
import { Timer } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

export function generateMetadata({
  params,
}: {
  params: { postId: string };
}): Metadata {
  const parsedID = parseInt(params.postId);
  if (posts[parsedID] === undefined) notFound();
  const { title, description } = posts[parsedID];
  return {
    title,
    description,
  };
}

function Post({ params }: { params: { postId: string } }) {
  const parsedID = parseInt(params.postId);
  if (posts[parsedID] === undefined) notFound();
  const { id, title, timeToRead, author } = posts[parsedID];
  const randomImage = faker.image.avatarLegacy();

  return (
    <section className="my-10 overflow-hidden rounded-lg border-b border-zinc-950/30 bg-zinc-200 dark:bg-zinc-900 ">
      <div className="relative before:absolute before:h-full before:w-full before:bg-gradient-to-t before:from-yellow-950/70 before:from-5% before:to-transparent before:content-['']">
        <Image
          className="bg-zinc-900"
          src={`https://picsum.photos/id/${id + 10}/1300/600.webp`}
          alt=""
          width={1300}
          height={600}
        />

        <h1 className="absolute bottom-2 left-5 mb-3 mt-5 text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h1>
      </div>
      <div className="relative max-w-6xl space-y-5 px-4 py-2 pb-10 font-serif text-xl/8 font-medium xl:mx-auto">
        <div className="flex items-end gap-6 font-sans">
          <div className=" bottom-3 left-5 mt-8 flex items-center gap-x-4">
            <Image
              width={50}
              height={50}
              src={randomImage}
              alt=""
              className="h-10 w-10 rounded-full bg-zinc-100"
            />
            <div className=" text-sm leading-6">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {author.name}
              </p>
              <p className="text-zinc-700 dark:text-zinc-400">{author.role}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-lg font-medium tracking-tighter text-zinc-700 dark:text-zinc-300">
            <Timer className="h-5 w-5" /> {timeToRead} min read
          </span>
        </div>
        <p className="text-zinc-900 first-letter:float-left first-letter:me-4 first-letter:text-6xl first-letter:font-bold first-letter:text-black first-line:first-letter:capitalize dark:text-zinc-100 dark:first-letter:text-white lg:first-letter:text-8xl ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dicta
          ipsum soluta nostrum quidem quasi totam, perspiciatis dolor veritatis,
          dignissimos blanditiis harum nisi, voluptate eaque inventore fugit
          amet. Nostrum, dignissimos. Inventore, incidunt facilis animi natus
          omnis consequuntur voluptas aliquam ut dignissimos expedita. Numquam
          quo magnam cupiditate porro, odio deleniti ab? Deleniti exercitationem
          sint quidem quod voluptas doloremque doloribus nemo vero. Assumenda
          animi, deserunt ratione fugit pariatur nihil. Debitis quam illo
          veritatis dignissimos ut possimus maiores totam. Perferendis omnis,
          nesciunt repudiandae cumque tempora quis suscipit quia necessitatibus
          alias ad laborum quas? Maxime, quia. Atque voluptas iure, omnis sint
          animi fuga repellendus dolor eius eos quam? Dignissimos iure iusto
          velit quisquam beatae expedita molestiae, odit quam vel voluptatum
          earum temporibus ea ipsa? Fugit possimus quasi, reprehenderit quam
          exercitationem laboriosam, eos vero accusamus aliquid suscipit
          corporis totam praesentium tempore repudiandae non numquam nostrum,
          natus nesciunt! Eaque similique iusto tempora molestias beatae,
          officiis perferendis! Adipisci aspernatur deserunt aut dolores,
          reiciendis impedit molestiae veniam ea nemo nostrum cumque distinctio
          quis, unde eum nihil expedita enim asperiores possimus qui optio!
          Nesciunt rem beatae sunt officiis eos! Voluptate vero cupiditate
          repellendus natus. Veniam nobis suscipit iste eos. Vero maiores quos
          hic doloribus dignissimos laboriosam
          <Image
            className="float-right m-5 me-0 rounded-lg"
            src={`https://picsum.photos/id/${id + 22}/400.webp`}
            alt=""
            width={400}
            height={400}
          />
          quibusdam voluptatibus distinctio ullam, similique libero nostrum
          asperiores excepturi eius. Nam, officiis temporibus? Inventore debitis
          numquam repudiandae quam tempora obcaecati laborum eius quaerat velit!
          Sint, necessitatibus earum. Ducimus, repudiandae veniam. Unde deserunt
          velit dolore et, ab nam asperiores reprehenderit corrupti quibusdam
          adipisci non! Ratione voluptate ipsa optio libero enim, accusamus
          assumenda repudiandae. Ex libero veritatis blanditiis eius cupiditate
          at neque eveniet, quam aspernatur dignissimos aliquid quibusdam
          accusantium error laborum culpa quo ratione incidunt? Eum iure fugit
          ipsam illum officiis labore accusantium quis ab corporis. Obcaecati
          quidem dolorem omnis non! Voluptatum, qui delectus pariatur quas quia
          natus non hic tempora! Cupiditate quasi quas magnam.
        </p>
        <p className="indent-4 first-line:first-letter:capitalize  ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dicta
          ipsum soluta nostrum quidem quasi totam, perspiciatis dolor veritatis,
          dignissimos blanditiis harum nisi, voluptate eaque inventore fugit
          amet. Nostrum, dignissimos. Inventore, incidunt facilis animi natus
          omnis consequuntur voluptas aliquam ut dignissimos expedita. Numquam
          quo magnam cupiditate porro, odio deleniti ab? Deleniti exercitationem
          sint quidem quod voluptas doloremque doloribus nemo vero. Assumenda
          animi, deserunt ratione fugit pariatur nihil. Debitis quam illo
          veritatis dignissimos ut possimus maiores totam. Perferendis omnis,
          nesciunt repudiandae cumque tempora quis suscipit quia necessitatibus
          alias ad laborum quas? Maxime, quia. Atque voluptas iure, omnis sint
          animi fuga repellendus dolor eius eos quam? Dignissimos iure iusto
          velit quisquam beatae expedita molestiae, odit quam vel voluptatum
          earum temporibus ea ipsa? Fugit possimus quasi, reprehenderit quam
          exercitationem laboriosam, eos vero accusamus aliquid suscipit
          corporis totam praesentium tempore repudiandae non numquam nostrum,
          natus nesciunt! Eaque similique iusto tempora molestias beatae,
          officiis perferendis! Adipisci aspernatur deserunt aut dolores,
          reiciendis impedit molestiae veniam ea nemo nostrum cumque distinctio
          quis, unde eum nihil expedita enim asperiores possimus qui optio!
          Nesciunt rem beatae sunt officiis eos! Voluptate vero cupiditate
          repellendus natus. Veniam nobis suscipit iste eos. Vero maiores quos
          hic doloribus dignissimos laboriosam quibusdam voluptatibus distinctio
          ullam, similique libero nostrum asperiores excepturi eius. Nam,
          officiis temporibus? Inventore debitis numquam repudiandae quam
          tempora obcaecati laborum eius quaerat velit! Sint, necessitatibus
          earum. Ducimus, repudiandae veniam. Unde deserunt velit dolore et, ab
          nam asperiores reprehenderit corrupti quibusdam adipisci non! Ratione
          voluptate ipsa optio libero enim, accusamus assumenda repudiandae. Ex
          libero veritatis blanditiis eius cupiditate at neque eveniet, quam
          aspernatur dignissimos aliquid quibusdam accusantium error laborum
          culpa quo ratione incidunt? Eum iure fugit ipsam illum officiis labore
          accusantium quis ab corporis. Obcaecati quidem dolorem omnis non!
          Voluptatum, qui delectus pariatur quas quia natus non hic tempora!
          Cupiditate quasi quas magnam.
        </p>
        <Image
          className="float-left m-5 ms-0 rounded-lg"
          src={`https://picsum.photos/id/${id + 23}/400.webp`}
          alt=""
          width={400}
          height={400}
        />
        <p className="indent-4 first-line:first-letter:capitalize ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dicta
          ipsum soluta nostrum quidem quasi totam, perspiciatis dolor veritatis,
          dignissimos blanditiis harum nisi, voluptate eaque inventore fugit
          amet. Nostrum, dignissimos. Inventore, incidunt facilis animi natus
          omnis consequuntur voluptas aliquam ut dignissimos expedita. Numquam
          quo magnam cupiditate porro, odio deleniti ab? Deleniti exercitationem
          sint quidem quod voluptas doloremque doloribus nemo vero. Assumenda
          animi, deserunt ratione fugit pariatur nihil. Debitis quam illo
          veritatis dignissimos ut possimus maiores totam. Perferendis omnis,
          nesciunt repudiandae cumque tempora quis suscipit quia necessitatibus
          alias ad laborum quas? Maxime, quia. Atque voluptas iure, omnis sint
          animi fuga repellendus dolor eius eos quam? Dignissimos iure iusto
          velit quisquam beatae expedita molestiae, odit quam vel voluptatum
          earum temporibus ea ipsa? Fugit possimus quasi, reprehenderit quam
          exercitationem laboriosam, eos vero accusamus aliquid suscipit
          corporis totam praesentium tempore repudiandae non numquam nostrum,
          natus nesciunt! Eaque similique iusto tempora molestias beatae,
          officiis perferendis! Adipisci aspernatur deserunt aut dolores,
          reiciendis impedit molestiae veniam ea nemo nostrum cumque distinctio
          quis, unde eum nihil expedita enim asperiores possimus qui optio!
          Nesciunt rem beatae sunt officiis eos! Voluptate vero cupiditate
          repellendus natus. Veniam nobis suscipit iste eos. Vero maiores quos
          hic doloribus dignissimos laboriosam quibusdam voluptatibus distinctio
          ullam, similique libero nostrum asperiores excepturi eius. Nam,
          officiis temporibus? Inventore debitis numquam repudiandae quam
          tempora obcaecati laborum eius quaerat velit! Sint, necessitatibus
          earum. Ducimus, repudiandae veniam. Unde deserunt velit dolore et, ab
          nam asperiores reprehenderit corrupti quibusdam adipisci non! Ratione
          voluptate ipsa optio libero enim, accusamus assumenda repudiandae. Ex
          libero veritatis blanditiis eius cupiditate at neque eveniet, quam
          aspernatur dignissimos aliquid quibusdam accusantium error laborum
          culpa quo ratione incidunt? Eum iure fugit ipsam illum officiis labore
          accusantium quis ab corporis. Obcaecati quidem dolorem omnis non!
          Voluptatum, qui delectus pariatur quas quia natus non hic tempora!
          Cupiditate quasi quas magnam.
        </p>
      </div>
    </section>
  );
}

export default Post;

import { Photo } from "../types/Photo";
import { storage } from "../libs/firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

export async function getAll() {
  let list: Photo[] = [];

  //acessando a past images do firebase
  const imagesFolder = ref(storage, "images");

  //listando tudo
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
}

export async function insert(file: File) {
  //aceitando apenas imgs
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
    let randomName = v4();
    let newFile = ref(storage, `images/${randomName}`);

    //ref arq = newFile, dados do arq = file
    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);

    return {
      name: upload.ref.name,
      url: photoUrl,
    } as Photo;
  } else {
    return new Error("Tipo de arquivo não pertido");
  }
}

export const deletePhoto = async (name: string) => {
  let photoRef = ref(storage, `images/${name}`);
  await deleteObject(photoRef);
};

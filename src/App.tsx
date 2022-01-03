import * as C from "./App.styles";
import React from "react";
import * as Photos from "./services/photos";
import { Photo } from "./types/Photo";
import PhotoItem from "./components/PhotoItem";

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [photos, setPhotos] = React.useState<Photo[]>([]);

  React.useEffect(() => {
    async function getPhotos() {
      //loading
      setLoading(true);

      //buscando a foto
      setPhotos(await Photos.getAll());

      setLoading(false);
    }

    getPhotos();
  }, []);

  async function getPhotos() {
    setLoading(true);
    setPhotos(await Photos.getAll());
    setLoading(false);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //pegando o formulário
    const formData = new FormData(e.currentTarget);

    //pegando o input image... especificando q é um arquivo
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      let result = await Photos.insert(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  }

  async function handleDeleteClick(name: string) {
    await Photos.deletePhoto(name);
    getPhotos();
  }

  return (
    <C.Container>
      <C.Area>
        <C.Header>Galeria de fotos</C.Header>

        {/* área de upload*/}
        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />
          {uploading && "Enviando..."}
        </C.UploadForm>

        {/* lista de fotos */}
        {loading && (
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((item, index) => (
              <PhotoItem
                key={index}
                url={item.url}
                name={item.name}
                onDelete={handleDeleteClick}
              />
            ))}
          </C.PhotoList>
        )}

        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <div className="emoji">😢</div>
            <div>Não há fotos cadastradas.</div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
}

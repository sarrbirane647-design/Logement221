import "../App.css";
import { useState } from "react";

function GalleryModal({
  showGallery,
  setShowGallery,
  media,
  currentIndex,
  setCurrentIndex,
}) {

  const [zoom, setZoom] = useState(1);

  if (!showGallery) return null;


  const nextMedia = () => {

    setCurrentIndex(
      currentIndex === media.length - 1
        ? 0
        : currentIndex + 1
    );

    setZoom(1);
  };


  const previousMedia = () => {

    setCurrentIndex(
      currentIndex === 0
        ? media.length - 1
        : currentIndex - 1
    );

    setZoom(1);
  };


  return (
    <div className="gallery-modal">

      <button
        className="close-gallery"
        onClick={() => setShowGallery(false)}
      >
        ✕
      </button>


      <button
        className="gallery-arrow left"
        onClick={previousMedia}
      >
        ◀️
      </button>


      {media[currentIndex]?.includes(".mp4") ? (

        <video
          controls
          autoPlay
          className="gallery-modal-media"
        >
          <source
            src={media[currentIndex]}
            type="video/mp4"
          />
        </video>

      ) : (

        <img
          src={media[currentIndex]}
          className="gallery-modal-media"
          alt=""
          onClick={() =>
            setZoom(zoom === 1 ? 2 : 1)
          }
          style={{
            transform:`scale(${zoom})`,
            transition:"0.3s",
            cursor:"zoom-in"
          }}
        />

      )}


      <button
        className="gallery-arrow right"
        onClick={nextMedia}
      >
        ▶️
      </button>


    </div>
  );
}

export default GalleryModal;
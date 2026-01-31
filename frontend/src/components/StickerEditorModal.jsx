import StickerCanvas from "./StickerCanvas";
import EditorControls from "./EditorControls";
import "../styles/stickerEditor.css";

const StickerEditorModal = ({ onClose }) => {
  return (
    <div className="sticker-modal">
      <div className="sticker-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="editor-layout">
          <EditorControls />
          <StickerCanvas />
        </div>
      </div>
    </div>
  );
};
export default StickerEditorModal;

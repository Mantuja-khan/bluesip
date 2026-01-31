import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import jsPDF from "jspdf";
import { Download, Trash2, Undo, Send, X } from "lucide-react";
import bottle1 from "../assets/bottle.png";
import drop from "../assets/elements/drop.png";

// Sample images

const fonts = ["Playfair Display", "Poppins", "Montserrat", "Inter"];
const elements = [
  { name: "Drop", src: drop },
  { name: "Wave", src: drop },
  { name: "Splash", src: drop },
];

const bottles = [
  { name: "Bottle 1", src: bottle1 },
  { name: "Bottle 2", src: bottle1 },
  { name: "Bottle 3", src: bottle1 },
  { name: "Bottle 4", src: bottle1 },
];

const StickerEditorModal = ({ onClose }) => {
  const canvasRef = useRef(null);
  const bottleRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeBottle, setActiveBottle] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [fontFamily, setFontFamily] = useState(fonts[0]);
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [color, setColor] = useState("#0f172a");
  const [bottleScale, setBottleScale] = useState(0.25);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const canvasWidth = isMobile ? window.innerWidth - 40 : 500;
    const canvasHeight = isMobile ? window.innerHeight - 280 : 600;

    const c = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });
    setCanvas(c);
    window.canvas = c;

    fabric.Image.fromURL(bottles[0].src, (img) => {
      img.set({
        left: c.width / 2,
        top: c.height / 2,
        originX: "center",
        originY: "center",
        scaleX: bottleScale,
        scaleY: bottleScale,
        selectable: true,
      });
      bottleRef.current = img;
      c.add(img);
      c.sendToBack(img);
      c.renderAll();
      saveHistory(c);
    });

    return () => c.dispose();
  }, []);

  const centerBottle = () => {
    if (!canvas || !bottleRef.current) return;
    bottleRef.current.set({ left: canvas.width / 2, top: canvas.height / 2 });
    canvas.renderAll();
  };

  const saveHistory = (c) => {
    if (!c) return;
    setHistory((h) => [...h.slice(-30), c.toJSON()]);
  };

  const undo = () => {
    if (history.length < 2 || !canvas) return;
    const prev = history[history.length - 2];
    canvas.loadFromJSON(prev, () => {
      canvas.renderAll();
      setHistory((h) => h.slice(0, -1));
    });
  };

  const switchBottle = (i) => {
    if (!canvas) return;
    fabric.Image.fromURL(bottles[i].src, (img) => {
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        scaleX: bottleScale,
        scaleY: bottleScale,
        selectable: true,
      });
      canvas.remove(bottleRef.current);
      bottleRef.current = img;
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.renderAll();
      setActiveBottle(i);
      saveHistory(canvas);
    });
  };

  const resizeBottle = (value) => {
    if (!bottleRef.current || !canvas) return;
    setBottleScale(value);
    bottleRef.current.scale(value);
    centerBottle();
    canvas.renderAll();
    saveHistory(canvas);
  };

  const addText = () => {
    if (!canvas) return;
    const t = new fabric.Textbox("Your Text", {
      fontFamily,
      fontSize,
      charSpacing: letterSpacing * 10,
      fill: color,
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: "center",
      originY: "center",
      selectable: true,
      width: 120,
    });
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.renderAll();
    saveHistory(canvas);
  };

  const addElement = (src) => {
    if (!canvas) return;
    fabric.Image.fromURL(src, (img) => {
      img.scaleToWidth(40);
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        selectable: true,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      saveHistory(canvas);
    });
  };

  const uploadImage = (e) => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        img.scaleToWidth(80);
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: "center",
          originY: "center",
          selectable: true,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        saveHistory(canvas);
      });
    };
    reader.readAsDataURL(file);
  };

  const applyColor = (c) => {
    setColor(c);
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj && obj.set) {
      obj.set("fill", c);
      canvas.renderAll();
      saveHistory(canvas);
    }
  };

  const del = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    canvas.remove(obj);
    canvas.renderAll();
    saveHistory(canvas);
  };

  const downloadPNG = () => {
    if (!canvas) return;
    const data = canvas.toDataURL({ format: "png", multiplier: 3 });
    const a = document.createElement("a");
    a.href = data;
    a.download = "sticker.png";
    a.click();
  };

  const downloadPDF = () => {
    if (!canvas) return;
    const pdf = new jsPDF();
    const img = canvas.toDataURL("image/png", 1.0);
    pdf.addImage(img, "PNG", 10, 10, 180, 0);
    pdf.save("sticker.pdf");
  };

  const sendToWhatsApp = () => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "sticker.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: "Sticker Design",
          text: "Check out this sticker design!"
        }).catch(() => fallbackWhatsAppShare());
      } else {
        fallbackWhatsAppShare();
      }
    }, "image/png");
  };

  const fallbackWhatsAppShare = () => {
    const message = encodeURIComponent("Please check the downloaded sticker image!");
    window.open(`https://wa.me/?text=${message}`, "_blank");
    downloadPNG();
  };

  const s = {
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "0" },
    content: { backgroundColor: "#fff", borderRadius: "0", maxWidth: "100%", width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" },
    close: { position: "absolute", top: "10px", right: "10px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 },
    layout: { display: "flex", height: "100%", overflow: "hidden" },
    left: { width: "280px", padding: "20px", backgroundColor: "#f8fafc", borderRight: "1px solid #e2e8f0", overflowY: "auto", maxHeight: "100vh" },
    right: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#fff", gap: "20px", overflowY: "auto" },
    title: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "18px", paddingBottom: "12px", borderBottom: "2px solid #e2e8f0" },
    section: { marginBottom: "16px" },
    sectionTitle: { fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" },
    group: { marginBottom: "10px" },
    label: { display: "block", fontSize: "12px", fontWeight: "500", color: "#334155", marginBottom: "5px" },
    select: { width: "100%", padding: "8px 10px", fontSize: "12px", border: "2px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", cursor: "pointer", outline: "none" },
    input: { width: "100%", padding: "8px 10px", fontSize: "12px", border: "2px solid #e2e8f0", borderRadius: "8px", outline: "none" },
    slider: { width: "100%", height: "6px", borderRadius: "3px", outline: "none", WebkitAppearance: "none", background: "linear-gradient(to right, #0ea5e9 0%, #38bdf8 100%)", cursor: "pointer" },
    btnGroup: { display: "flex", gap: "8px", flexWrap: "wrap" },
    btn: { flex: 1, minWidth: "fit-content", padding: "8px 12px", fontSize: "12px", fontWeight: "600", border: "2px solid #e2e8f0", borderRadius: "8px", backgroundColor: "white", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" },
    primary: { backgroundColor: "#0ea5e9", color: "white", border: "2px solid #0ea5e9" },
    danger: { backgroundColor: "#ef4444", color: "white", border: "2px solid #ef4444" },
    whatsapp: { backgroundColor: "#25D366", color: "white", border: "2px solid #25D366", padding: "12px 20px", fontSize: "14px", fontWeight: "600", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 6px -1px rgba(37, 211, 102, 0.3)" },
    canvas: { display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" },
    color: { width: "100%", height: "40px", border: "2px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", outline: "none" },
    upload: { display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", fontSize: "12px", fontWeight: "600", border: "2px dashed #cbd5e1", borderRadius: "8px", backgroundColor: "white", cursor: "pointer", color: "#475569" },
    mobileCtrl: { width: "100%", backgroundColor: "#fff", borderTop: "2px solid #e2e8f0", position: "fixed", bottom: 0, left: 0, right: 0 },
    mobileBar: { display: "flex", justifyContent: "space-around", padding: "6px 4px", gap: "2px", borderBottom: "1px solid #e2e8f0" },
    mobileBtn: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6px 2px", fontSize: "9px", fontWeight: "600", border: "none", borderRadius: "6px", backgroundColor: "transparent", color: "#64748b", cursor: "pointer", gap: "2px" },
    mobileBtnActive: { backgroundColor: "#0ea5e9", color: "white" },
    mobileIcon: { fontSize: "16px" },
    mobilePanel: { padding: "12px", backgroundColor: "#f8fafc", maxHeight: "220px", overflowY: "auto" },
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
          .layout-mobile { flex-direction: column !important; }
          .right-mobile { 
            padding: 10px !important; 
            height: calc(100vh - 200px) !important;
            max-height: none !important;
          }
          .canvas-mobile { 
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
          }
          .canvas-mobile canvas {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
          }
          .whatsapp-mobile {
            padding: 8px 16px !important;
            fontSize: 12px !important;
            position: fixed !important;
            bottom: 160px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            zIndex: 100 !important;
          }
          .whatsapp-mobile svg {
            width: 14px !important;
            height: 14px !important;
          }
          .content-mobile {
            borderRadius: 0 !important;
            maxWidth: 100% !important;
            height: 100vh !important;
          }
          .close-mobile {
            top: 8px !important;
            right: 8px !important;
            width: 32px !important;
            height: 32px !important;
          }
          .mobile-panel-label {
            fontSize: 11px !important;
          }
          .mobile-panel-input,
          .mobile-panel-select {
            fontSize: 11px !important;
            padding: 6px 8px !important;
          }
          .mobile-panel-btn {
            fontSize: 11px !important;
            padding: 6px 10px !important;
          }
        }
        @media (min-width: 769px) {
          .desktop-only { display: block !important; }
          .mobile-only { display: none !important; }
          .content-desktop {
            borderRadius: 16px !important;
            maxWidth: 1400px !important;
            height: 95vh !important;
          }
        }
      `}</style>

      <div style={s.content} className="content-mobile content-desktop" onClick={(e) => e.stopPropagation()}>
        <button style={s.close} className="close-mobile" onClick={onClose}><X size={20} /></button>

        <div style={s.layout} className="layout-mobile">
          {/* DESKTOP LEFT PANEL */}
          <div style={s.left} className="desktop-only">
            <h1 style={s.title}>Sticker Editor</h1>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>Bottle Settings</h2>
              <div style={s.group}>
                <label style={s.label}>Select Bottle</label>
                <select style={s.select} value={activeBottle} onChange={(e) => switchBottle(Number(e.target.value))}>
                  {bottles.map((b, i) => <option key={i} value={i}>{b.name}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Bottle Size</label>
                <input type="range" min="0.15" max="0.4" step="0.01" value={bottleScale} onChange={(e) => resizeBottle(Number(e.target.value))} style={s.slider} />
              </div>
            </div>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>Text Settings</h2>
              <div style={s.group}>
                <label style={s.label}>Font Family</label>
                <select style={s.select} value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                  {fonts.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Font Size</label>
                <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={s.input} min="10" max="60" />
              </div>
              <div style={s.group}>
                <label style={s.label}>Letter Spacing</label>
                <input type="number" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} style={s.input} min="-5" max="20" />
              </div>
              <div style={s.group}>
                <label style={s.label}>Text Color</label>
                <input type="color" value={color} onChange={(e) => applyColor(e.target.value)} style={s.color} />
              </div>
              <button style={{...s.btn, ...s.primary, width: "100%"}} onClick={addText}>Add Text</button>
            </div>
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Design Elements</h2>
              <div style={s.group}>
                <label style={s.label}>Add Element</label>
                <select style={s.select} onChange={(e) => { const i = Number(e.target.value); if (i >= 0) addElement(elements[i].src); e.target.value = ""; }} defaultValue="">
                  <option value="" disabled>Choose element...</option>
                  {elements.map((el, i) => <option key={el.name} value={i}>{el.name}</option>)}
                </select>
              </div>
              <div style={s.group}>
                <label style={s.label}>Upload Image</label>
                <label style={s.upload}>
                  <input type="file" onChange={uploadImage} style={{display: "none"}} accept="image/*" />
                  📁 Choose File
                </label>
              </div>
            </div>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>Actions</h2>
              <div style={s.btnGroup}>
                <button style={s.btn} onClick={undo}><Undo size={14} />Undo</button>
                <button style={{...s.btn, ...s.danger}} onClick={del}><Trash2 size={14} />Delete</button>
              </div>
            </div>

            <div style={s.section}>
              <h2 style={s.sectionTitle}>Export</h2>
              <div style={s.btnGroup}>
                <button style={{...s.btn, ...s.primary}} onClick={downloadPNG}><Download size={14} />PNG</button>
                <button style={{...s.btn, ...s.primary}} onClick={downloadPDF}><Download size={14} />PDF</button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - CANVAS */}
          <div style={s.right} className="right-mobile">
            <div style={s.canvas} className="canvas-mobile">
              <canvas ref={canvasRef} />
            </div>
            <button style={s.whatsapp} className="whatsapp-mobile" onClick={sendToWhatsApp}><Send size={18} />Send to WhatsApp</button>
          </div>

          {/* MOBILE BOTTOM CONTROLS */}
          <div style={s.mobileCtrl} className="mobile-only">
            <div style={s.mobileBar}>
              <button style={{...s.mobileBtn, ...(activeSection === 'bottle' ? s.mobileBtnActive : {})}} onClick={() => setActiveSection(activeSection === 'bottle' ? null : 'bottle')}>
                <span style={s.mobileIcon}>🍾</span>Bottle
              </button>
              <button style={{...s.mobileBtn, ...(activeSection === 'text' ? s.mobileBtnActive : {})}} onClick={() => setActiveSection(activeSection === 'text' ? null : 'text')}>
                <span style={s.mobileIcon}>Aa</span>Text
              </button>
              <button style={{...s.mobileBtn, ...(activeSection === 'elements' ? s.mobileBtnActive : {})}} onClick={() => setActiveSection(activeSection === 'elements' ? null : 'elements')}>
                <span style={s.mobileIcon}>✨</span>Elements
              </button>
              <button style={{...s.mobileBtn, ...(activeSection === 'actions' ? s.mobileBtnActive : {})}} onClick={() => setActiveSection(activeSection === 'actions' ? null : 'actions')}>
                <span style={s.mobileIcon}>⚙️</span>Actions
              </button>
            </div>

            {activeSection === 'bottle' && (
              <div style={s.mobilePanel}>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Select Bottle</label>
                  <select style={s.select} className="mobile-panel-select" value={activeBottle} onChange={(e) => switchBottle(Number(e.target.value))}>
                    {bottles.map((b, i) => <option key={i} value={i}>{b.name}</option>)}
                  </select>
                </div>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Bottle Size</label>
                  <input type="range" min="0.15" max="0.4" step="0.01" value={bottleScale} onChange={(e) => resizeBottle(Number(e.target.value))} style={s.slider} />
                </div>
              </div>
            )}

            {activeSection === 'text' && (
              <div style={s.mobilePanel}>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Font Family</label>
                  <select style={s.select} className="mobile-panel-select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    {fonts.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Font Size</label>
                  <input type="number" className="mobile-panel-input" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={s.input} min="10" max="60" />
                </div>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Letter Spacing</label>
                  <input type="number" className="mobile-panel-input" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} style={s.input} min="-5" max="20" />
                </div>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Text Color</label>
                  <input type="color" value={color} onChange={(e) => applyColor(e.target.value)} style={s.color} />
                </div>
                <button style={{...s.btn, ...s.primary, width: "100%"}} className="mobile-panel-btn" onClick={addText}>Add Text</button>
              </div>
            )}

            {activeSection === 'elements' && (
              <div style={s.mobilePanel}>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Add Element</label>
                  <select style={s.select} className="mobile-panel-select" onChange={(e) => { const i = Number(e.target.value); if (i >= 0) addElement(elements[i].src); e.target.value = ""; }} defaultValue="">
                    <option value="" disabled>Choose element...</option>
                    {elements.map((el, i) => <option key={el.name} value={i}>{el.name}</option>)}
                  </select>
                </div>
                <div style={s.group}>
                  <label style={{...s.label, fontSize: "11px"}} className="mobile-panel-label">Upload Image</label>
                  <label style={{...s.upload, fontSize: "11px"}}>
                    <input type="file" onChange={uploadImage} style={{display: "none"}} accept="image/*" />
                    📁 Choose File
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'actions' && (
              <div style={s.mobilePanel}>
                <div style={s.btnGroup}>
                  <button style={s.btn} className="mobile-panel-btn" onClick={undo}><Undo size={12} />Undo</button>
                  <button style={{...s.btn, ...s.danger}} className="mobile-panel-btn" onClick={del}><Trash2 size={12} />Delete</button>
                </div>
                <div style={{...s.btnGroup, marginTop: "8px"}}>
                  <button style={{...s.btn, ...s.primary}} className="mobile-panel-btn" onClick={downloadPNG}><Download size={12} />PNG</button>
                  <button style={{...s.btn, ...s.primary}} className="mobile-panel-btn" onClick={downloadPDF}><Download size={12} />PDF</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerEditorModal;
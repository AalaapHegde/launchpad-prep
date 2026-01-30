import './ImagePlaceholder.css'

function ImagePlaceholder({ text, aspectRatio = '16/9', className = '' }) {
  return (
    <div
      className={`image-placeholder ${className}`}
      style={{ aspectRatio }}
    >
      <span className="placeholder-text">{text}</span>
    </div>
  )
}

export default ImagePlaceholder

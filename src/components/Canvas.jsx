import { useRef, useEffect } from 'react'
import "../index.css"

const Canvas = props => {

  // eslint-disable-next-line react/prop-types
  const { draw, ...rest } = props
  const canvasRef = useRef(null)

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    draw(context)

  }, [draw])

  return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas

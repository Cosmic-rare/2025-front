import { ReactNode, useState, useEffect } from "react"

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const resize = () => {
  const width = window.innerWidth
  const height = width * 1.45
  return { height: height, width: width }
}

const Print = () => {
  const [innerSize, setInnerSize] = useState({ height: 0, width: 0 })
  const handleResize = () => {
    setInnerSize(resize())
  }
  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
  }, [])


  return (
    <div>
      <div style={{ width: innerSize.width, height: innerSize.height, backgroundColor: 'red' }}>
        afsdasdfasdf
      </div>
      <div style={{ width: innerSize.width, height: innerSize.height, backgroundColor: 'blue' }}>
        bbbbbbbbb
      </div>
      <div style={{ width: innerSize.width, height: innerSize.height, backgroundColor: 'green' }}>
        bbbbbbbbb
      </div>
    </div>
  )

}

export default Print

Print.getLayout = function getLayout(page: ReactNode) {
  return page
}

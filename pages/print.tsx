import { ReactNode, useState, useEffect } from "react"

const resize = () => {
  const width = window.innerWidth
  const height = Math.round(width * 1.455)
  const height25 = height / 4
  const height50 = height - 2 * height25
  return { height: height, width: width, height25: height25, height50: height50 }
}

const Print = () => {
  const [innerSize, setInnerSize] = useState({ height: 0, width: 0, height25: 0, height50: 0 })
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
      <div style={{ width: innerSize.width, height: innerSize.height25, backgroundColor: 'green' }}>名前、注意文、QRコード</div>
      <div style={{ width: innerSize.width, height: innerSize.height25, backgroundColor: 'red' }}>何も書かない</div>
      <div style={{ width: innerSize.width, height: innerSize.height50, backgroundColor: 'blue' }}>役員以外開封禁止って書いてあるホチキスの場所が上、左にトーナメント記録者名種目指示など、右に記録する表とかフラグとか</div>
      <div style={{ width: innerSize.width, height: innerSize.height25, backgroundColor: 'orange' }}></div>
      <div style={{ width: innerSize.width, height: innerSize.height25, backgroundColor: 'gray' }}></div>
      <div style={{ width: innerSize.width, height: innerSize.height50, backgroundColor: 'black' }}></div>
    </div>
  )

}

export default Print

Print.getLayout = function getLayout(page: ReactNode) {
  return page
}

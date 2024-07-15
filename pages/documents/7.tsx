import Head from "next/head"

const width = {
  xs: 0.9, sm: 400, md: 500, lg: 500, xl: 500,
}

const Documents = () => {
  return (
    <div style={{ height: "100%" }}>
      <Head>
        <title>要項</title>
      </Head>

      <div style={{ display: "flex", justifyContent: "center", height: "100%", flexDirection: "column" }}>
        <h2>要項</h2>

<div style={{ height: "100%" }}>
<embed src="https://s3.tani-exe.net/tournament2024/R6スポーツ大会晴晴B日程.pdf" width="100%" style={{ height: "calc(var(--100vh) - 155px)" }}
          type="application/pdf"></embed>
</div>
  
      </div>
    </div>
  )
}

export default Documents
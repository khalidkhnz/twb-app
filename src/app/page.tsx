import { Link } from "next-view-transitions";

export default function Home() {
  return (
    <main className="">
      {" "}
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Link href="/collect-tokens" style={{ cursor: "pointer" }}>
          <button
            style={{
              width: "200px",
              height: "50px",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "10px",
              margin: "10px",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            Collect Token
          </button>
        </Link>
      </div>
    </main>
  );
}

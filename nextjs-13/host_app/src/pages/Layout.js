import Link from "next/link";

const Layout = ({children})=>{
    return (
        <>
          <div className="flex flex-col gap-12 w-56 bg-blue-200">
            <Link href={"/"}>HOME</Link>
            <Link href={"/client1"}>Client 1</Link>
            <Link href={"/client2"}>Client 2</Link>
          </div>
          <div>{children}</div>
        </>
    )
}
export default Layout;
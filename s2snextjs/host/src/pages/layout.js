import Link from "next/link"

const Layout = ({children}) => {
    return (
        <div className="flex flex-row">
            <div className="w-[200px] flex flex-col *:py-2 *:px-4">
                <Link href={"/"}>Host</Link>
                <Link href={"/client"}>Client</Link>
                
            </div>
            <div className="flex-1 p-4">{children}</div>
        </div>
    )
}

export default Layout;
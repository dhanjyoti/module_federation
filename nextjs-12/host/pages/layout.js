import Link from "next/link";
const Layout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href={"/"} >Home</Link>
        <Link href={"/client1"} >Client1</Link>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default Layout

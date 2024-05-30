const { Suspense, lazy } = require("react");

const Client = lazy(() => import("client2/host_app"));

const Page =()=>{
    return (
        <div>
           <Suspense fallback="Client 2 is loading">
            <Client />
           </Suspense>
        </div>
    )
}
export default Page;
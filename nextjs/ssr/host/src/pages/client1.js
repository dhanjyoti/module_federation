import { lazy, Suspense } from "react";

const ClientIndex = lazy(() => import("client1/index"));
const ClientNewpage = lazy(() => import("client1/newpage"));

const Page = ()=>{
    return <div>
        <Suspense fallback={"Client 1 is loading.."}>
            <ClientIndex/>
        </Suspense>
        <Suspense fallback={"Client 1 is loading.."}>
            <ClientNewpage/>
        </Suspense>
    </div>
}

export default Page


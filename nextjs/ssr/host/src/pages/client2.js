import { lazy, Suspense } from "react";

const Client = lazy(() => import("client2/home"));

const Page = ()=>{
    return <div>
        <Suspense fallback={"Client 2 is loading.."}>
            <Client/>
        </Suspense>
    </div>
}

export default Page


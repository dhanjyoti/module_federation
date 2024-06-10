import {lazy, Suspense, useEffect, useState} from "react";

const ClientIndex = lazy(()=> import("client/index"));


const Page =()=>{
    const [data, setData] = useState([]);
    useEffect(()=>{
        (async ()=>{
            const x = await(await fetch("/api/hello")).json();
            setData(x)
        })();
    },[])

    return (
        <div>
            <div>
                {data && (
                    <>
                        <p>{data.id}</p>
                        <p>{data.name}</p>
                        <p>{data.company}</p>
                    </>
                )}
            </div>
            <Suspense fallback={"Client is loading..."}>
                <ClientIndex />
            </Suspense>
        </div>
    )
}

export default Page;
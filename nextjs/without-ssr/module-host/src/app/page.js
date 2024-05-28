"use client"

import { Suspense, lazy, useEffect, useState } from "react";

const RemoteApp = lazy(() => import("client/Page"));


export default function Home() {
  const [X, setX]=useState(null)

  useEffect(()=>{
    setX(RemoteApp)
  },[])

  return (
    <div>
      I am host
      <Suspense fallback={"loading..."}>
        {X && <X/>}
      </Suspense>
    </div>
  );
}

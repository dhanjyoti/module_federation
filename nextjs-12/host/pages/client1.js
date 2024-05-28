const { Suspense, lazy } = require("react");

const Client = lazy(() => import("client1/home"));

const Page = () => {
  return (
    <div>
      <Suspense fallback="Client 1 is loading">
        <Client />
      </Suspense>
    </div>
  );
};

export default Page

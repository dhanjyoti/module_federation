const { Suspense, lazy } = require("react");
const Client2 = lazy(() => import("client2/app"));

const Client = () => {
  return (
    <div>
      <Suspense fallback="Client 2 is loading...">
        <Client2 />
      </Suspense>
    </div>
  );
};

export default Client

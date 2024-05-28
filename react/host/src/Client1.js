const { Suspense, lazy } = require("react");
const Client1 = lazy(() => import("client/app"));

const Client = () => {
  return (
    <div>
      <Suspense fallback="Client 1 is loading...">
        <Client1 />
      </Suspense>
    </div>
  );
};

export default Client

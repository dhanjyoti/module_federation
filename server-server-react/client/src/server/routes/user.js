
export async function userRoute(req, res) {
  const response = {
    id: 1337,
    name: 'John Doe',
    company: 'Acme Inc.',
  };

  res.json(response);
}

export default userRoute;
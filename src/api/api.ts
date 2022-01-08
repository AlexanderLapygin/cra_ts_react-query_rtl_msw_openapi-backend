const defaultFetchOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function api(endpoint: any, fetchOptions = defaultFetchOptions) {
  try {
    const data: any = await fetch(`http://localhost:8000/api${endpoint}`, fetchOptions);
    if (!data.ok) {
      throw new Error(data.status);
    }
    const json = await data.json();
    return json;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

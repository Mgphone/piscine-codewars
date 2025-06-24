export async function fetchUserData(username) {
  const url = `https://www.codewars.com/api/v1/users/${username}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Can not find the data of ${username}`);
  }
  return res.json();
}

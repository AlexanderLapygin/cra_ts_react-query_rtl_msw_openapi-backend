import { useMutation, useQueryClient } from 'react-query';
import { api } from '../api/api';

async function updateUser(userId: any, newUserInfo: any) {
  try {
    return api(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // @ts-ignore
      body: JSON.stringify(newUserInfo),
    });
  } catch (error) {
    // @ts-ignore
    throw new Error(`Error updating User with Id ${userId}: `, error);
  }
}

export function UpdateUser({ userId }: any) {
  const queryClient = useQueryClient();
  const updateUserMutation = useMutation((newUserInfo) => updateUser(userId, newUserInfo), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return (
    <button
      onClick={() =>
        // @ts-ignore
        updateUserMutation.mutate({
          name: 'Anna',
        })
      }
    >
      Update User
    </button>
  );
}

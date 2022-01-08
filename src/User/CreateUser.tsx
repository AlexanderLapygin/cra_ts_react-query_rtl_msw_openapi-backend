import { useMutation, useQueryClient } from 'react-query';
import { api } from '../api/api';

async function createUser(newUser: any) {
  try {
    return api(`/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // @ts-ignore
      body: JSON.stringify(newUser),
    });
  } catch (error) {
    // @ts-ignore
    throw new Error(`Error creating User with Id ${newUser.id}: `, error);
  }
}

export function CreateUser() {
  const queryClient = useQueryClient();
  const createUserMutation = useMutation((newUser) => createUser(newUser), {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
  });

  return (
    <button
      onClick={() =>
        // @ts-ignore
        createUserMutation.mutate({
          id: '4',
          name: 'John',
          email: 'john@aol.com',
        })
      }
    >
      Create new User
    </button>
  );
}

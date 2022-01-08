import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Users } from './User/Users';
import { User } from './User/User';

console.log('process.env.NODE_ENV = ' + process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./api/mocks/browser');
  worker.start();
}

const queryClient = new QueryClient();

function App() {
  const [selectedUser, setSelectedUser]: any = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      {selectedUser ? (
        <User userId={selectedUser.id} setSelectedUser={setSelectedUser} />
      ) : (
        <Users setSelectedUser={setSelectedUser} />
      )}
    </QueryClientProvider>
  );
}

export default App;

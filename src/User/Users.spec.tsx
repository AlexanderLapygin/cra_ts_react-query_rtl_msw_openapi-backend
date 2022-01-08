import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { rest } from 'msw';
import { Users } from './Users';
import { mockUsers } from '../api/mocks/db';
import {OpenAPIBackend} from "openapi-backend";
import path from "path";
import {setupServer} from "msw/node";

// define api
const api = new OpenAPIBackend({
  definition: path.join(__dirname, '../../api', 'todo-api.yaml'),
  handlers: {
    validationFail: async (c, req, res) => res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),
    notImplemented: async (c, req, res) => {
      const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId as string);
      return res.status(status).json(mock);
    },
  },
});

// tell msw to intercept all requests to api/* with our mock
const server = setupServer(
  rest.get('/api/*', (req: any, res, ctx) => api.handleRequest(req, res, ctx))
);

describe('Users', () => {
  test('renders loading', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Loading Users...')).toBeInTheDocument();
    });
  });

  test('lists users', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    );

    await waitFor(() => {
      mockUsers.forEach((mockUser) => {
        expect(screen.getByText(mockUser.name, { exact: false })).toBeInTheDocument();
      });
    });
  });

  test('create new user', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    );

    const createButton = await screen.findByText('Create new User');

    fireEvent.click(createButton);

    const newUserInList = await screen.findByText('Name: John');
    expect(newUserInList).toBeInTheDocument();
  });

  test('renders Error', async () => {
    server.use(
      rest.get('http://localhost:8000/api/users/', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            errorMessage: `Internal Server Error`,
          })
        );
      })
    );
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // disable retries to force an error response
        },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
    });
  });
});

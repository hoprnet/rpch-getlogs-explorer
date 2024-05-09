import './App.css';
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config-wagmi'
import Logs from './Logs';

const queryClient = new QueryClient();







function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Logs/>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

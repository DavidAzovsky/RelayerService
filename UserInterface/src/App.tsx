import { MetamaskProvider } from "./metamask/context";
import HelloMetamask from "./components/ReceiverForwarder";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';


export default function App() {
  return (
    <div>
    <MetamaskProvider>
      <HelloMetamask />
      <ToastContainer />
    </MetamaskProvider>
    </div>
  );
}

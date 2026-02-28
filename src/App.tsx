import "./App.css";
import Main from "./components/Main";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <>
      <DataProvider>
        <Main />
      </DataProvider>
    </>
  );
}

export default App;

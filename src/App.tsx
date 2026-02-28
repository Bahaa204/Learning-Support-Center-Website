import Main from "./components/Main";
import { DataProvider } from "./context/DataContext";
export default function App() {
  return (
    <>
      <DataProvider>
        <Main />
      </DataProvider>
    </>
  );
}

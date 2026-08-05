import { hello } from '@ephemera/schemas';
import { Counter } from './components/Counter';

function App() {
  return (
    <>
      <p>{hello()}</p>
      <Counter />
    </>
  );
}

export default App;

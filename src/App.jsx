import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => <h2>Головна сторінка (доступна всім)</h2>;
const Login = () => <h2>Сторінка входу</h2>;
const Checkout = () => <h2>Сторінка оплати (захищена)</h2>;
const History = () => <h2>Історія покупок (захищена)</h2>;

function App() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '15px', padding: '10px', background: '#eee' }}>
        <Link to="/">Головна</Link>
        <Link to="/login">Увійти</Link>
        <Link to="/checkout">Оплата</Link>
        <Link to="/history">Історія</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;